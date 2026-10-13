const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash-preview-05-20'];

async function evaluateCode(code, problem) {
    const prompt = `
You are a strict code judge for a competitive programming platform.

Problem Title: ${problem.title}
Problem Description: ${problem.description}

User's submitted code:
\`\`\`
${code}
\`\`\`

Evaluate this code. Reply STRICTLY in this JSON format with no markdown ticks:
{
  "isCorrect": true or false,
  "verdict": "Accepted" or "Wrong Answer" or "Incomplete Solution",
  "feedback": "One short sentence of feedback."
}
`;

    for (const model of MODELS) {
        try {
            const response = await ai.models.generateContent({ model, contents: prompt });
            const text = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        } catch (err) {
            console.error(`Gemini model ${model} failed:`, err.message);
        }
    }

    return { isCorrect: false, verdict: 'Error', feedback: 'Could not evaluate. Please try again.' };
}

module.exports = { evaluateCode };