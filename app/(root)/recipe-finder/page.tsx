'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

import axios from 'axios'

interface Recipe {
  id: string
  name: string
  ingredients: string[]
  instructions: string
  prepTime: number
  cookTime: number
  servings: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

export default function RecipeFinder() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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

  const findRecipes = async () => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add some ingredients before searching for recipes.",
        variant: "destructive",
      })
      return
    }
  
    setIsLoading(true)
    try {
      const response = await axios.post<{ recipes: Recipe[] }>('/api/find-recipes', { ingredients })
      setRecipes(response.data.recipes)
      if (response.data.recipes.length === 0) {
        toast({
          title: "No recipes found",
          description: "We couldn't find any recipes with your ingredients. Try adding more ingredients.",
        })
      }
    } catch (error) {
      console.error('Error finding recipes:', error)
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data
        toast({
          title: "Error",
          description: errorData.error + (errorData.details ? `: ${errorData.details}` : ''),
          variant: "destructive",
        })
        if (errorData.aiResponse) {
          console.log('AI Response:', errorData.aiResponse)
        }
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addToTracker = async (recipe: Recipe) => {
    try {
      await axios.post('/api/nutrition-entries', {
        food: recipe.name,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat
      })
      toast({
        title: "Recipe Added",
        description: `${recipe.name} has been added to your nutrition tracker.`,
      })
    } catch (error) {
      console.error('Error adding recipe to tracker:', error)
      toast({
        title: "Error",
        description: "Failed to add recipe to tracker. Please try again.",
        variant: "destructive",
      })
    }
  }
  return (
    <ToastProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Recipe Finder</h1>
        <p className='text-sm text-center'>Got Ingredients but you don't know what to eat? upload of a photo of them or enter them to get recipes'</p>
        
        <div className="mb-6 mt-6">
          <h2 className="text-xl mb-2 font-semibold">Upload Image of Ingredients</h2>
          <Input 
            type="file" 
            onChange={handleImageUpload} 
            accept="image/*" 
            disabled={isLoading}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
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

        <Button onClick={findRecipes} disabled={isLoading || ingredients.length === 0} className="w-full mb-6">
          {isLoading ? "Searching..." : "Find Recipes"}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id}>
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">Prep Time: {recipe.prepTime} min | Cook Time: {recipe.cookTime} min | Servings: {recipe.servings}</p>
                <h3 className="font-semibold mb-1">Ingredients:</h3>
                <ul className="list-disc list-inside mb-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm">
                      {ingredient}
                    </li>
                    
                  ))}
                  <li>
                  <Button onClick={() => addToTracker(recipe)}>Add to Tracker</Button>
                  </li>
                </ul>
                <h3 className="font-semibold mb-1">Instructions:</h3>
                <p className="text-sm">{recipe.instructions}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}



