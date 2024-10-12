'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface Recipe {
  id: string
  name: string
  ingredients: string[]
  instructions: string
  prepTime: number
  cookTime: number
  servings: number
}

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchSavedRecipes()
  }, [])

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get('/api/saved-recipes')
      setSavedRecipes(response.data.recipes)
    } catch (error) {
      console.error('Error fetching saved recipes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch saved recipes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeRecipe = async (recipeId: string) => {
    try {
      await axios.delete(`/api/saved-recipes?id=${recipeId}`)
      setSavedRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId))
      toast({
        title: "Recipe Removed",
        description: "The recipe has been removed from your saved recipes.",
      })
    } catch (error) {
      console.error('Error removing recipe:', error)
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message
        toast({
          title: "Error",
          description: `Failed to remove recipe: ${errorMessage}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const navigateBack =()=>{
    router.push('/food-finder')
  }

  return (
    <div className="container min-h-screen mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Saved Recipes</h1>
      <Button onClick={navigateBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recipe Finder
        </Button>
      {savedRecipes.length === 0 ? (
        <p className="text-center">You haven't saved any recipes yet.</p>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {savedRecipes.map((recipe, index) => (
              <Card key={recipe.id} className="w-[300px]">
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
                <CardFooter>
                  <Button onClick={() => removeRecipe(recipe.id)} variant="destructive" className="w-full">Remove</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  )
}