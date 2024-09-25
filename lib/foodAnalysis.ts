import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeFood(input: string | File): Promise<{
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
    const imageData = await input.arrayBuffer();
    imageParts = [
      {
        inlineData: {
          data: Buffer.from(imageData).toString('base64'),
          mimeType: input.type,
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

    // Parse the response
    const nameMatch = text.match(/Name: (.+)/);
    const ingredientsMatch = text.match(/Ingredients:\n((?:- .+\n)+)/);
    const preparationMatch = text.match(/Preparation:\n((?:\d+\. .+\n)+)/);

    if (!nameMatch || !ingredientsMatch || !preparationMatch) {
      throw new Error("Failed to parse AI response");
    }

    const name = nameMatch[1].trim();
    const ingredients = ingredientsMatch[1].split('\n').filter(i => i.trim()).map(i => i.replace('- ', '').trim());
    const preparationProcess = preparationMatch[1].split('\n').filter(p => p.trim()).map(p => p.replace(/^\d+\. /, '').trim());

    return {
      name,
      ingredients,
      preparationProcess,
    };
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw new Error('Failed to analyze food');
  }
}