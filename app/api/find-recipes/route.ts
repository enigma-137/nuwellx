import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ingredients } = await request.json();

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid ingredients provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Given the following ingredients: ${ingredients.join(
      ", "
    )}, suggest 3 traditional African recipes or dishes commonly prepared in Africa using local ingredients. The recipes should be well-known within African cuisine. For each recipe, provide the following information in a JSON array:
    [
      {
        "name": "Recipe Name",
        "ingredients": ["Ingredient 1", "Ingredient 2", ...],
        "instructions": "Step-by-step instructions",
        "prepTime": preparation time in minutes,
        "cookTime": cooking time in minutes,
        "servings": number of servings,
        "calories": estimated calories per serving,
        "protein": estimated protein in grams per serving,
        "carbs": estimated carbs in grams per serving,
        "fat": estimated fat in grams per serving
      }
    ]
    Ensure that the output is a valid JSON array containing exactly 3 traditional African recipe objects. Do not include any additional text, markdown formatting, or code blocks in your response. Avoid suggesting recipes that are not commonly known in Africa, Avoid suggesting recipes that are not related to the provided ingredients.`;

    const result = await model.generateContent(prompt);
    let recipesString = result.response.text();

    //console.log('AI Response:', recipesString) // Log the AI's response for debugging

    // Remove any potential backticks or code block formatting
    recipesString = recipesString.replace(/```json\n?|\n?```/g, "").trim(); //Imagine how I struggled to fix this if not for AI

    let recipes;
    try {
      recipes = JSON.parse(recipesString);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI response", aiResponse: recipesString },
        { status: 500 }
      );
    }

    if (!Array.isArray(recipes) || recipes.length !== 3) {
      console.error("Invalid AI response format:", recipes);
      return NextResponse.json(
        { error: "Invalid AI response format", aiResponse: recipesString },
        { status: 500 }
      );
    }

    // Store the recipes in the database
    const storedRecipes = await Promise.all(
      recipes.map(async (recipe: any) => {
        return prisma.recipe.create({
          data: {
            name: recipe.name,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            userId: userId,
          },
        });
      })
    );

    return NextResponse.json({ recipes: storedRecipes });
  } catch (error) {
    console.error("Error finding recipes:", error);
    return NextResponse.json(
      { error: "Failed to find recipes", details: (error as Error).message },
      { status: 500 }
    );
  }
}
