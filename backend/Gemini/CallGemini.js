import {GoogleGenAI} from "@google/genai";
import "dotenv/config";
import {response} from "express";


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINAI_API_KEY,
});

async function geminiForSynonyms(word){
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

async function geminiForClues(wordObject){
    console.log("ive been called");
    console.log(wordObject);
    const word = wordObject.word;
    let attempts = 0;
    while(attempts < 10){
        try{
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                systemInstruction: "Only return English phrases in valid JSON format, Speak in a professional manner, use clear and direct language",
                contents: [{role: 'user', parts: [{text:
                            `Generate exactly one crossword style clue for ${word}. Make sure that the clues DO NOT 
                        include the word "${word}" itself. Output as a JSON array of strings with 
                        no special characters or underscores. The response must be at least 5 words long`}]}],
                config: {
                    responseMimeType: 'application/json',
                    temperature: 1.5, // how related the words are
                    topP: 1.0, // how diverse the pool is
                }
            });

            const data = JSON.parse(response.text);

            // validate data

            if(Array.isArray(data) && data.length > 0
            && data[0].length >= 5 && !data[0].toLowerCase().includes(word.toLowerCase())){
                console.log(data);
                console.log("sucess");
                return data;
            }
            console.log("Failed to output correct data for word: ", word  + "attemps: " + (attempts+1));

        }catch(err){
            console.log("Failed to output correct data for word: ", word  + "attemps: " + (attempts+1));
        }
        attempts++;

    }
}


export{
    geminiForSynonyms,
    geminiForClues,
}

