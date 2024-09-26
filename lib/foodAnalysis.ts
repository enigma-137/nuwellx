import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ImageInput {
  buffer: ArrayBuffer;
  mimeType: string;
}

export async function analyzeFood(input: string | ImageInput): Promise<{
  name: string;
  ingredients: string[];
  preparationProcess: string[];
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let prompt: string;
  let imageParts: any[] = [];

  if (typeof input === 'string') {
    prompt = `Analyze the food "${input}" and provide:
1. The full name of the dish
2. A list of ingredients
3. A step-by-step preparation process

Format the response as follows:
Name: [Food Name]
Ingredients:
- [Ingredient 1]
- [Ingredient 2]
...
Preparation:
1. [Step 1]
2. [Step 2]
...`;
  } else {
    imageParts = [
      {
        inlineData: {
          data: Buffer.from(input.buffer).toString('base64'),
          mimeType: input.mimeType,
        },
      },
    ];
    prompt = `Analyze the image of food and provide:
1. The name of the dish
2. A list of likely ingredients
3. A possible step-by-step preparation process

Format the response as follows:
Name: [Food Name]
Ingredients:
- [Ingredient 1]
- [Ingredient 2]
...
Preparation:
1. [Step 1]
2. [Step 2]
...`;
  }

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const text = response.text();

    console.log("AI Response:", text); // Log the full AI response for debugging

    // More flexible parsing
    let name = '', ingredients: string[] = [], preparationProcess: string[] = [];

    // Extract name
    const nameMatch = text.match(/Name:\s*(.+)/);
    if (nameMatch) {
      name = nameMatch[1].trim();
    }

    // Extract ingredients
    const ingredientsMatch = text.match(/Ingredients:([\s\S]*?)(?=Preparation:|$)/);
    if (ingredientsMatch) {
      ingredients = ingredientsMatch[1].split('\n')
        .map(i => i.replace(/^-?\s*/, '').trim())
        .filter(Boolean);
    }

    // Extract preparation steps
    const preparationMatch = text.match(/Preparation:([\s\S]*?)$/);
    if (preparationMatch) {
      preparationProcess = preparationMatch[1].split('\n')
        .map(p => p.replace(/^\d+\.?\s*/, '').trim())
        .filter(Boolean);
    }

    console.log("Parsed result:", { name, ingredients, preparationProcess });

    if (!name && ingredients.length === 0 && preparationProcess.length === 0) {
      throw new Error("No usable information found in AI response");
    }

    return {
      name: name || "Unknown dish",
      ingredients: ingredients.length > 0 ? ingredients : ["No ingredients provided"],
      preparationProcess: preparationProcess.length > 0 ? preparationProcess : ["No preparation steps provided"],
    };
  } catch (error) {
    console.error('Error in analyzeFood:', error);
    console.error('Input type:', typeof input === 'string' ? 'text' : 'image');
    throw new Error('Failed to analyze food: ' + (error instanceof Error ? error.message : String(error)));
  }
}