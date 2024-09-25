'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import axios from 'axios'

interface FoodAnalysis {
  name: string
  ingredients: string[]
  preparationProcess: string[]
}

export function FoodAnalyzer() {
  const [foodAnalysis, setFoodAnalysis] = useState<FoodAnalysis | null>(null)
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
        const response = await axios.post('/api/analyze-food', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setFoodAnalysis(response.data.foodAnalysis)
        toast({
          title: "Food Analyzed",
          description: "We've analyzed the food image you provided.",
        })
      } catch (error) {
        console.error('Error analyzing food:', error)
        toast({
          title: "Error",
          description: "Failed to analyze food image. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleTextInput = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputRef.current && inputRef.current.value) {
      setIsLoading(true)
      const foodName = inputRef.current.value.trim()
      try {
        const response = await axios.post('/api/analyze-food', { foodName })
        setFoodAnalysis(response.data.foodAnalysis)
        toast({
          title: "Food Analyzed",
          description: `We've analyzed ${foodName} for you.`,
        })
      } catch (error) {
        console.error('Error analyzing food:', error)
        toast({
          title: "Error",
          description: "Failed to analyze food. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        inputRef.current.value = ''
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Food Analyzer</h2>
      <p className='text-sm mb-4'>Upload an image of a prepared food or enter its name to get ingredients and preparation process</p>
      
      <div className="mb-6">
        <h3 className="text-xl mb-2 font-semibold">Upload Food Image</h3>
        <Input 
          type="file" 
          onChange={handleImageUpload} 
          accept="image/*" 
          disabled={isLoading}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-xl mb-2 font-semibold">Or Enter Food Name</h3>
        <form onSubmit={handleTextInput} className="flex gap-2">
          <Input 
            type="text" 
            placeholder="Enter food name" 
            ref={inputRef}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>Analyze</Button>
        </form>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {foodAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>{foodAnalysis.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold mb-2">Ingredients:</h4>
            <ul className="list-disc list-inside mb-4">
              {foodAnalysis.ingredients.map((ingredient, index) => (
                <li key={index} className="text-sm">{ingredient}</li>
              ))}
            </ul>
            <h4 className="font-semibold mb-2">Preparation Process:</h4>
            <ol className="list-decimal list-inside">
              {foodAnalysis.preparationProcess.map((step, index) => (
                <li key={index} className="text-sm mb-2">{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  )
}