import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
export const generateScript = async (part: string) => {
  const prompt = `Write a script to generate a 30 seconds video on topic:"${part}" along with AI Image Prompt in realistic format for each scene and give me the result in JSON format with ImagePrompt and contentText as fields.PLEASE DONT GIVE ANY OTHER RESPONSE like "scene1, etc". JUST GIVE WHAT I ASKED ONLY. keep the name of the response array as "content" - which would be containing the objects. DO NOT INCLUDE BACKTICKS IN THE RESPONSE`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
};
