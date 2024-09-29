'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Image as LucideImage } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent,CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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

  const resetRecipes = () => {
    setRecipes([])
    setIngredients([])
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const cardColors = [
    'bg-gradient-to-br from-pink-100 to-rose-200',
    'bg-gradient-to-br from-blue-100 to-cyan-200',
    'bg-gradient-to-br from-green-100 to-emerald-200',
  ]

  return (
    <ToastProvider>
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe Finder</h1>
      
      {recipes.length === 0 ? (
        <>
          <p className='text-sm text-center mb-6'>Got Ingredients but you don't know what to eat? Upload a photo of them or enter them to get recipes</p>
          
          <div className="mb-6">
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
                <LucideImage className="mx-auto h-10 w-10 " />
                <p className="text-gray-500 mt-2">Drag and drop or <span className="text-blue-600 cursor-pointer">browse</span></p>
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
              {recipes.slice(0, 3).map((recipe, index) => (
                <Card key={recipe.id} className={`w-[300px] ${cardColors[index % cardColors.length]}`}>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{recipe.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">Prep: {recipe.prepTime} min | Cook: {recipe.cookTime} min | Servings: {recipe.servings}</p>
                    <h3 className="font-semibold mb-1">Ingredients:</h3>
                    <ScrollArea className="h-32 w-full rounded-md border p-2">
                      <ul className="list-disc list-inside">
                        {recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="text-sm">{ingredient}</li>
                        ))}
                      </ul>
                    </ScrollArea>
                    <h3 className="font-semibold mt-2 mb-1">Instructions:</h3>
                    <ScrollArea className="h-32 w-full rounded-md border p-2">
                      <p className="text-sm whitespace-normal">{recipe.instructions}</p>
                    </ScrollArea>
                  </CardContent>
                  {/* <CardFooter>
                    <Button onClick={() => addToTracker(recipe)} className="w-full">Add to Tracker</Button>
                  </CardFooter> */}
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



