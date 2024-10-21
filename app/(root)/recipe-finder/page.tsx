'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { BookmarkIcon, Image as LucideImage } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { recipes as localRecipes, Recipe } from '@/data/recipeData'

export default function RecipeFinder() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [matchedRecipes, setMatchedRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsLoading(true)
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await axios.post('/api/recognize-ingredients', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setIngredients(prevIngredients => {
          const newIngredients = response.data.ingredients as string[]
          return Array.from(new Set([...prevIngredients, ...newIngredients]))
        })
        toast({
          title: "Ingredients recognized",
          description: "We've added the recognized ingredients to your list.",
        })
      } catch (error) {
        console.error('Error recognizing ingredients:', error)
        toast({
          title: "Error",
          description: "Failed to recognize ingredients. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleTextInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputRef.current && inputRef.current.value) {
      const newIngredient = inputRef.current.value.trim()
      if (newIngredient && !ingredients.includes(newIngredient)) {
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
        inputRef.current.value = ''
        toast({
          title: "Ingredient added",
          description: `${newIngredient} has been added to your list.`,
        })
      }
    }
  }

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient !== ingredientToRemove))
  }

  const findRecipes = () => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add some ingredients before searching for recipes.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simple matching algorithm
    const matchedRecipes = localRecipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase())
      return ingredients.some(ing => recipeIngredients.includes(ing.toLowerCase()))
    })

    // Sort recipes by the number of matching ingredients
    matchedRecipes.sort((a, b) => {
      const aMatches = a.ingredients.filter(ing => 
        ingredients.includes(ing.name.toLowerCase())).length
      const bMatches = b.ingredients.filter(ing => 
        ingredients.includes(ing.name.toLowerCase())).length
      return bMatches - aMatches
    })

    setMatchedRecipes(matchedRecipes.slice(0, 3))  // Get top 3 matches

    if (matchedRecipes.length === 0) {
      toast({
        title: "No recipes found",
        description: "We couldn't find any recipes with your ingredients. Try adding more ingredients.",
      })
    }

    setIsLoading(false)
  }

  const resetRecipes = () => {
    setMatchedRecipes([])
    setIngredients([])
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const saveRecipe = async (recipe: Recipe) => {
    try {
      await axios.post('/api/saved-recipes', recipe)
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

  const navigateToSavedRecipes = () => {
    router.push('/saved-recipes')
  }

  return (
    <ToastProvider>
      <div className="container min-h-[75vh] mx-auto p-4">
        <p className='text-sm text-center mb-6'>Got Ingredients but you don't know what to eat? Upload a photo of them or enter them to get recipes</p>
        <Button onClick={navigateToSavedRecipes} variant="outline">
          <BookmarkIcon className="mr-2 h-4 w-4" />
          Saved Recipes
        </Button>
        {matchedRecipes.length === 0 ? (
          <>
          {/* wahala */}
            <div className="mb-6 mt-6">
              <h2 className="text-xl mb-2 font-semibold">Upload Image of Ingredients</h2>
              <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-blue-50 relative">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={isLoading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="text-center pointer-events-none">
                  <LucideImage className="mx-auto text-sky-600 h-10 w-10 " />
                  <p className=" text-gray-600 mt-2">Drag and drop or <span className="text-sky-600 cursor-pointer">browse</span></p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl mb-2 font-semibold">Or Enter Ingredients Manually</h2>
              <form onSubmit={handleTextInput} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter an ingredient"
                  ref={inputRef}
                  className="flex-grow"
                />
                <Button type="submit" disabled={isLoading}>Add</Button>
              </form>
            </div>

            <div className="mb-6">
              <h2 className="text-xl mb-2 font-semibold">Your Ingredients:</h2>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={() => removeIngredient(ingredient)}
                  >
                    {ingredient}
                    <span className="text-xs">&times;</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={findRecipes} disabled={isLoading || ingredients.length === 0} className="w-full bg-sky-600 text-white mb-6">
              {isLoading ? "Searching..." : "Find Recipes"}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={resetRecipes} className="w-full mb-6">Find New Recipes</Button>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-4 p-4">
                {matchedRecipes.map((recipe, index) => (
                  <Card key={recipe.food_name} className={`w-[300px]`}>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">{recipe.food_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">Prep: {recipe.preparation_time} | Cook: {recipe.cooking_time} | Servings: {recipe.servings}</p>
                      <h3 className="font-semibold mb-1 ">Ingredients:</h3>
                      <ScrollArea className="h-32 w-full rounded-md p-2">
                        <ul className="list-disc list-inside">
                          {recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx} className="text-sm">{ingredient.name}: {ingredient.quantity}</li>
                          ))}
                        </ul>
                      </ScrollArea>
                      <h3 className="font-semibold mt-2 mb-1">Instructions:</h3>
                      <ScrollArea className="h-32 w-full rounded-md p-2">
                        <ol className="list-decimal list-inside">
                          {recipe.preparation_instructions.map((instruction, idx) => (
                            <li key={idx} className="text-sm whitespace-normal">{instruction}</li>
                          ))}
                        </ol>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => saveRecipe(recipe)} className="w-full">Save Recipe</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </>
        )}
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}