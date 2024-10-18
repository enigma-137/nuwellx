import recipesJson from './recipes.json';

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  food_name: string;
  preparation_time: string;
  cooking_time: string;
  total_time: string;
  course: string;
  cuisine: string;
  servings: number;
  calories: number | null;
  ingredients: Ingredient[];
  preparation_instructions: string[];
}

export const recipes: Recipe[] = recipesJson.recipes;

export async function getRecipes(): Promise<Recipe[]> {
  // In a real-world scenario, this could be an API call
  // For now, we'll just return the data after a short delay to simulate an async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recipes);
    }, 1000);
  });
}