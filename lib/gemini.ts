import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeImage(imageData: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Analyze this food image and provide nutritional information and other relevant details.";

  const result = await model.generateContent([prompt, { inlineData: { data: imageData, mimeType: "image/jpeg" } }]);

  return result.response.text();
}