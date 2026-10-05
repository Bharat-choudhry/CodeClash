const { GoogleGenAI } = require('@google/genai');


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateQuestion() {
    const promptText = `
    Act as an expert competitive programming platform.
    Generate a random data structures and algorithms coding question (Easy or Medium difficulty).
    Return strictly in JSON format with the following structure without any markdown ticks:
    {
        "title": "Question Title",
        "difficulty": "Easy",
        "description": "Full problem description here.",
        "testCases": [
            { "input": "...", "output": "..." },
            { "input": "...", "output": "..." }
        ]
    }
    `;

    try {
        
        const interaction = await ai.interactions.create({
            model: "gemini-3.8-flash",
            input: promptText
        });

     
        let responseText = interaction.output_text;
        
       
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(responseText);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
}

module.exports = { generateQuestion };