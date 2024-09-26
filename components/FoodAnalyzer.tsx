'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Loader2Icon } from "lucide-react"
import { Image as LucideImage } from 'lucide-react';
import axios from 'axios'
import Markdown from 'react-markdown'

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
        const response = await axios.post('/api/analyze-food', 
          { foodName },
          { headers: { 'Content-Type': 'application/json' } }
        )
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

  const resetAnalysis = () => {
    setFoodAnalysis(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Food Analyzer</h2>
      
      {!foodAnalysis ? (
        <>
          <p className='text-sm mb-4'>Upload an image of a prepared food or enter its name to get ingredients and preparation process</p>
          
          <div className="mb-6">
            <h3 className="text-xl mb-2 font-semibold">Upload Food Image</h3>
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-blue-50 relative">
              <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                disabled={isLoading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center pointer-events-none">
                <LucideImage className="mx-auto h-10 w-10 text-gray-500" />
                <p className="text-gray-500 mt-2">Drag and drop or <span className="text-blue-600 cursor-pointer">browse</span></p>
              </div>
            </div>
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
        </>
      ) : (
        <Button onClick={resetAnalysis} className="mb-4">Analyze Another Food</Button>
      )}

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
            <ul className="mb-4 list-none">
              {foodAnalysis.ingredients.map((ingredient, index) => (
                <li key={index} className="text-sm"><Markdown>{ingredient}</Markdown></li>
              ))}
            </ul>
            <h4 className="font-semibold mb-2">Preparation Process:</h4>
            <ul className="list-none">
              {foodAnalysis.preparationProcess.map((step, index) => (
                <li key={index} className="text-sm mb-2"><Markdown>{step}</Markdown></li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}