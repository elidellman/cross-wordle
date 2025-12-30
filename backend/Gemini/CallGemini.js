import {GoogleGenAI} from "@google/genai";
import "dotenv/config";
import {response} from "express";


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINAI_API_KEY,
});

async function callGemini(word){
    console.log(word);
    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            systemInstruction: "Generate exactly 5 related words. Do not provide synonyms. Focus on items, concepts, or actions associated with the topic.",
            contents: [{role: 'user', parts: [{text:
                        `Generate 5 words related to but not synonyms of "${word}". Output as a JSON array of strings.`}]}],
            config: {
                responseMimeType: 'application/json',
                temperature: 1.5, // how related the words are
                topP: 1.0, // how diverse the pool is
            }
        });
        return response.text;
    }catch(err){
        return err;
    }

}


export default callGemini;