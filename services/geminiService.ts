import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, CardType } from "../types";

const processNewsText = async (rawText: string, mode: CardType = 'news'): Promise<GeneratedContent> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  let systemInstruction = '';
  let schemaDescription = {};

  if (mode === 'quote') {
    // Instruction for Quote Card - STRICTLY Bengali
    systemInstruction = `
      You are a specialized Bengali Editor for Basherkella Quote Cards.
      CRITICAL RULE: ALL OUTPUT MUST BE IN BENGALI LANGUAGE ONLY.
      
      Your Task:
      1. Analyze the input text carefully.
      2. Extract the CORE QUOTE (what the person actually said) translated to or kept in Bengali.
      3. Extract the Speaker's Name and Designation in Bengali.
      
      Output Rules:
      - 'headline': The Quote text itself in Bengali. (Do not add quotation marks).
      - 'body': The Speaker's Name + Designation in Bengali (e.g. "ড. মুহাম্মদ ইউনূস, প্রধান উপদেষ্টা").
      - 'caption': Write a short, engaging social media caption in Bengali (2-3 sentences).
    `;
    schemaDescription = {
      headline: { type: Type.STRING, description: "The direct quote text in Bengali script" },
      body: { type: Type.STRING, description: "Speaker name and designation in Bengali script" },
      caption: { type: Type.STRING, description: "Social media caption in Bengali script" }
    };
  } else {
    // Instruction for News Card - STRICTLY Bengali
    systemInstruction = `
      You are a Senior News Editor for a top-tier Bengali News Portal (Basherkella).
      CRITICAL RULE: ALL OUTPUT MUST BE IN BENGALI LANGUAGE ONLY. DO NOT USE ENGLISH WORDS.
      
      Your Goal: 
      1. Create a CATCHY and ATTRACTIVE headline in Bengali.
      2. Write a DETAILED "News Analysis" (নিউজ বিশ্লেষণ) report in Bengali.

      INPUT ANALYSIS RULES:
      - Read the whole text carefully.
      - Extract the core facts.
      - Neutralize any bias.

      OUTPUT FIELDS:
      1. 'headline': 
         - Must be VERY CATCHY and ATTRACTIVE.
         - Max 3 lines visually (approx 5-15 words).
         - Language: Bengali.
      
      2. 'body':
         - Leave empty or max 1 very short sentence in Bengali if context is needed.
      
      3. 'caption':
         - This is the Detailed News Analysis (নিউজ বিশ্লেষণ).
         - Format: Full journalistic report style.
         - Language: Strictly Bengali.
         - Length: Detailed and Long.
    `;
    schemaDescription = {
      headline: { type: Type.STRING, description: "A catchy news headline in Bengali (max 3 lines)" },
      body: { type: Type.STRING, description: "Optional short context in Bengali" },
      caption: { type: Type.STRING, description: "Detailed news analysis/report in Bengali language" }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: rawText,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: schemaDescription,
          required: ["headline", "body", "caption"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Error processing text:", error);
    throw error;
  }
};

export { processNewsText };