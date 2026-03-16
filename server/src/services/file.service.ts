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
                numpages: null, // Word docs don't give a simple page count this way
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