import pdf from 'pdf-parse-new';
import mammoth from 'mammoth';
import { Buffer } from 'buffer';

const extractTextFromFile = async (buffer: Buffer, mimetype: string) => {
    try {
        if (mimetype === "application/pdf") {
            const data = await pdf(buffer);
            return {
                text: data.text,
                numpages: data.numpages,
                info: data.info,
            };
        } 
        else if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            // Unpack Word Document
            const data = await mammoth.extractRawText({ buffer: buffer });
            return {
                text: data.value,
                numpages: null, 
                info: "Parsed DOCX",
            };
        } 
        else if (mimetype.startsWith("text/")) {
            return {
                text: buffer.toString('utf-8'),
                numpages: null,
                info: "Parsed Plain Text",
            };
        }
        
        throw new Error("Unsupported file type");
    }
    catch (error) {
         throw new Error("Failed to extract text from file: " + (error as Error).message);
    }
}

export default extractTextFromFile;

export const chunkText = (text: string, maxChunkSize: number = 12000): string[] => {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\s*\n/);
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxChunkSize) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += " " + sentence;
        }
      }
      continue;
    }

    if ((currentChunk + "\n\n" + paragraph).length > maxChunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += "\n\n" + paragraph;
    }
  }

  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks;
};