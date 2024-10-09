// @/lib/gemini.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeImage(imageData: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze this food image and provide a detailed nutritional breakdown. Include the following sections:

1.  Food Identification: Identify the main food items in the image.
2.  Nutritional Overview: Provide an overview of the nutritional value.
3.  Macronutrients: Break down the macronutrients (proteins, carbs, fats).
4.  Micronutrients: List key vitamins and minerals.
5.  Health Benefits: Mention potential health benefits.
6.  Considerations: Note any potential allergens or dietary considerations.


Format the response in Markdown, using an emoji after each section heading.`;

  const result = await model.generateContent([prompt, { inlineData: { data: imageData, mimeType: "image/jpeg" } }]);
  const response = await result.response;
  const text = response.text();
  return text;
}