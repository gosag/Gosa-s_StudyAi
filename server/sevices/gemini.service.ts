import { GoogleGenerativeAI } from "@google/generative-ai";
interface CustomError extends Error{
    status?:number | string,
    statusCode?:number | string
}
export async function generateResponse(prompt:string):Promise<string>{
    try{
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is completely missing from process.env");
        }

        const GenAi = new GoogleGenerativeAI(apiKey);
        const echoLearnPrompt = `You are the core AI assistant for a learning platform called EchoLearn. 

                You operate in two primary modes based on the input data:

                1. Initial Summarization Mode (If the input is raw text, a transcript, or a document):
                - Provide a concise, high-value, and informative summary.
                - For Transcripts/Audio: Extract key points, main ideas, and actionable takeaways. Filter out filler words.
                - For Text Documents: Summarize main themes, core arguments, and crucial supporting details.
                - Structure: Use clean Markdown (headings, bullet points, bold text). Maintain a professional, clear, and academic tone. Do not add conversational filler.
                - At the end of the summary, include a section titled "Key Takeaways" with 3-5 bullet points that highlight the most important information for quick review.

                2. Conversational Tutoring Mode (If the input is a conversation history):
                - Act as an interactive tutor to help the user understand the content better.
                - Review the entire conversation history, but focus on addressing the latest user message.
                - Answer questions directly, clearly, and concisely using the previously summarized educational context.
                - Maintain a helpful, encouraging, and academic tone. Do not re-summarize everything unless explicitly asked to do so.`;
                const fullPrompt = `${echoLearnPrompt}\n\nInput Data (Content to summarize OR Conversation history):\n${prompt}`;
        const generationConfiguration={
            temperature:0.7,
            maxOutputTokens:1500,
        }
        const model = GenAi.getGenerativeModel({
            //gemini-2.5-pro or
            //gemini-2.5-flash-lite 
            model: "gemini-2.5-flash-lite",
            generationConfig: generationConfiguration,
        });
        const result = await model.generateContent(fullPrompt);
        console.log(result);
        return result.response.text();
    }
    catch(error:any){
        /* console.error("Error generating response:", error); */
        if(error?.status===429){
            const err = new Error("Gemini API rate limit exceeded. Please try again later.") as CustomError;
            err.status = 429;
            throw err;
        }
        else{
            const err = new Error("An error occurred while generating response from Gemini API. Please try again later.") as CustomError;
            err.status = 500;
            throw err;
        }
    }
}