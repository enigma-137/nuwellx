'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  id: string;
  food_name: string;
  preparation_time: string;
  cooking_time: string;
  servings: number;
  ingredients: Ingredient[];
  preparation_instructions: string[];
}

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchSavedRecipes()
  }, [])

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get('/api/saved-recipes')
      setRecipes(response.data.recipes)
    } catch (error) {
      console.error('Error fetching saved recipes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch saved recipes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeRecipe = async (id: string) => {
    try {
      await axios.delete(`/api/saved-recipes?id=${id}`)
      setRecipes(recipes.filter(recipe => recipe.id !== id))
      toast({
        title: "Recipe Removed",
        description: "The recipe has been removed from your saved recipes.",
      })
    } catch (error) {
      console.error('Error removing recipe:', error)
      toast({
        title: "Error",
        description: "Failed to remove recipe. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container min-h-[75vh] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Saved Recipes</h1>
      {recipes.length === 0 ? (
        <p className="text-center">You haven't saved any recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id}>
              <CardHeader>
                <CardTitle>{recipe.food_name}</CardTitle>
                <CardDescription>
                  Prep: {recipe.preparation_time} | Cook: {recipe.cooking_time} | Servings: {recipe.servings}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-1">Ingredients:</h3>
                <ScrollArea className="h-32 w-full rounded-md border p-2">
                  <ul className="list-disc list-inside">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="text-sm">
                        {ingredient.name}: {ingredient.quantity}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
                <h3 className="font-semibold mt-2 mb-1">Instructions:</h3>
                <ScrollArea className="h-32 w-full rounded-md border p-2">
                  <ol className="list-decimal list-inside">
                    {recipe.preparation_instructions.map((instruction, idx) => (
                      <li key={idx} className="text-sm whitespace-normal">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button onClick={() => removeRecipe(recipe.id)} variant="destructive" className="w-full">
                  Remove Recipe
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}