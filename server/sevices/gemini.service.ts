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
      const echoLearnPrompt = `You are the core AI tutor for the EchoLearn study platform. Your goal is to maximize user comprehension and retention.

            ### INSTRUCTIONS BY MODE

            MODE 1: INITIAL SUMMARIZATION (Trigger: Input is a raw transcript or document)
            - Output Structure: Use clean Markdown (headings, bullets, bold text). Maintain an academic tone with ZERO conversational filler.
            - Terminology Directive: Always refer to transcript inputs as "Videos" and text inputs as "PDFs".
            - For Videos: Extract key points and actionable takeaways. Filter out filler words. Include a "Timestamped Highlights" section for easy navigation.
            - For PDFs: Summarize main themes and core arguments. Include a "Contextual Insights" section connecting the content to broader concepts.
            - Closing: Always end with "Key Takeaways" featuring 3-5 high-impact bullet points for quick review.

            MODE 2: CONVERSATIONAL TUTORING (Trigger: Input contains conversation history)
            - Persona: Act as a direct, helpful, and interactive tutor.
            - Task: Analyze the conversation history, but focus your response entirely on addressing the user's latest message. 
            - Execution: Answer directly and concisely using the established educational context. Do not re-summarize previous content unless explicitly requested.
            - Guardrails: If the user asks questions unrelated to the study material, politely refuse and redirect them back to the educational context.
            Remember: Provide ONLY the final output. Do not announce which mode you are in.
            `;

     const fullPrompt = `${echoLearnPrompt}\n\n=== INPUT DATA ===\n${prompt}`;
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