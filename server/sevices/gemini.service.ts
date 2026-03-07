import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateResponse(prompt:string):Promise<string>{
    try{
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is completely missing from process.env");
        }

        const GenAi = new GoogleGenerativeAI(apiKey);
        const echoLearnPrompt = `You are the core AI assistant for a learning platform called EchoLearn. Your primary task is to provide concise, high-value, and informative summaries of the educational content provided to you.
                Core Directives:
                1. Content-Specific Summarization:
                - For Transcripts (Video/Audio): Focus on extracting key points, main ideas, and actionable takeaways. Filter out filler words, tangents, and conversational fluff.
                - For Text Documents: Summarize the main themes, core arguments, and crucial supporting details.

                2. Clarity & Structure: Ensure your responses are impeccably organized and easy to digest at a glance. Always use clean Markdown. Use headings (###), bullet points, and bold text for crucial vocabulary or concepts.

                3. Conciseness vs. Value: Always aim to maximize educational value while keeping the summary strictly concise. Do not omit critical context, but do not repeat yourself.

                4. Tone: Maintain a professional, clear, and academic tone. Do not add conversational filler (e.g., do not say "Here is your summary"). Just output the summary directly.`;
        const fullPrompt = `${echoLearnPrompt}\n\nContent to summarize:\n${prompt}`;
        const generationConfiguration={
            temperature:0.7,
            maxOutputTokens:1500,
        }
        const model = GenAi.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: generationConfiguration,
        });
        const result = await model.generateContent(fullPrompt);
        return result.response.text();
    }
    catch(error){
        console.error("Error generating response:", error);
        throw new Error("Failed to generate response from Gemini API");
    }
}