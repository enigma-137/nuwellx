'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { recipes, Recipe } from '@/data/recipeData'
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image'

export default function RecipeSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (searchTerm.length > 2) {
      const filteredRecipes = recipes.filter(recipe => 
        recipe.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      setSearchResults(filteredRecipes)
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const saveRecipe = async (recipe: Recipe) => {
    try {
      await fetch('/api/saved-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      })
      toast({
        title: "Recipe Saved",
        description: `${recipe.food_name} has been saved to your recipes.`,
      })
    } catch (error) {
      console.error('Error saving recipe:', error)
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container min-h-[75vh] mx-auto p-4 flex flex-col">
      <Input
        type="text"
        placeholder="Search recipes by name or ingredient..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 mt-4"
      />
      {searchResults.length === 0 && searchTerm.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 mb-4">
            <Image 
              src="/empty.jpg" 
              alt="empty" 
              layout="fill" 
              objectFit="contain"
            />
          </div>
          <p className='text-muted-foreground text-center'>Search for a recipe</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((recipe) => (
            <Card key={recipe.food_name}>
              <CardHeader>
                <CardTitle>{recipe.food_name}</CardTitle>
                <CardDescription>{recipe.cuisine}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Preparation Time: {recipe.preparation_time}</p>
                <p>Cooking Time: {recipe.cooking_time}</p>
                <p>Servings: {recipe.servings}</p>
                {recipe.calories && <p>Calories: {recipe.calories}</p>}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedRecipe(recipe)}>View Recipe</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{selectedRecipe?.food_name}</DialogTitle>
                      <DialogDescription>{selectedRecipe?.cuisine}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
                      <ul className="list-disc pl-5 mb-4">
                        {selectedRecipe?.ingredients.map((ingredient, idx) => (
                          <li key={idx}>{ingredient.name}: {ingredient.quantity}</li>
                        ))}
                      </ul>
                      <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
                      <ol className="list-decimal pl-5">
                        {selectedRecipe?.preparation_instructions.map((instruction, idx) => (
                          <li key={idx} className="mb-2">{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => saveRecipe(recipe)}>Save Recipe</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {searchResults.length === 0 && searchTerm.length > 2 && (
        <p className="text-center mt-4">No recipes found. Try a different search term.</p>
      )}
    </div>
  )
}