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
            systemInstruction: "Generate exactly 10 related English words. They must not be any shorter than 4 characters long" +
                ". Do not provide synonyms. Focus on items, concepts, or actions associated with the topic.",
            contents: [{role: 'user', parts: [{text:
                        `Generate exactly 10 English words related to but not synonyms of "${word}". The words must be 
                        at least 4 characters or longer. Output as a JSON array of strings with 
                        no spaces or underscores.`}]}],
            config: {
                responseMimeType: 'application/json',
                temperature: 1.5, // how related the words are
                topP: 1.0, // how diverse the pool is
            }
        });

        // cleanse text here


        return response.text;
    }catch(err){
        return err;
    }

}


export default callGemini;