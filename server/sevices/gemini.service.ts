import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateResponse(prompt:string):Promise<string>{
    try{
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is completely missing from process.env");
        }
        
        // Initialize inside the function to guarantee the env var is fully loaded
        const GenAi = new GoogleGenerativeAI(apiKey);
        const generationConfiguration={
            temperature:0.7,
            maxOutputTokens:1500,
        }
        
        // 👇 FIX: Changed "gemini-1.5-flash-latest" to "gemini-1.5-flash" 👇
        const model = GenAi.getGenerativeModel({
            model: "gemini-2.5-flash", 
            generationConfig: generationConfiguration
        });

        const result = await model.generateContent(prompt);
        return result.response.text();
    }
    catch(error){
        console.error("Error generating response:", error);
        throw new Error("Failed to generate response from Gemini API");
    }
}