'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Image as LucideImage, ChevronRight } from "lucide-react"
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
    <div className="container mx-auto p-4 min-h-[75vh]">
      <h2 className="text-3xl font-bold mb-6 text-center text-sky-600">Food Analyzer</h2>
      
      {!foodAnalysis ? (
        <Card className=" shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl ">Analyze Your Food</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm mb-6'>Upload an image of a prepared food or enter its name to get ingredients and preparation process</p>
            
            <div className="mb-6">
              <h3 className="text-xl mb-2 font-semibold">Upload Food Image</h3>
              <div className="w-full h-48 border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-indigo-50 relative hover:bg-indigo-100 transition-colors">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={isLoading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="text-center pointer-events-none">
                  <LucideImage className="mx-auto h-10 w-10 text-sky-600" />
                  <p className=" text-gray-700 mt-2">Drag and drop or <span className="text-sky-600 underline">browse</span></p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl mb-2 font-semibold ">Or Enter Food Name</h3>
              <form onSubmit={handleTextInput} className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Enter food name" 
                  ref={inputRef}
                  className="flex-grow border-indigo-300 focus:border-sky-600 focus:ring-sky-600"
                />
                <Button type="submit" disabled={isLoading} className="bg-sky-600 hover:bg-sky-700">
                  Analyze
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={resetAnalysis} className="mb-6 bg-sky-600 hover:bg-sky-700">
          Analyze Another Food
        </Button>
      )}

      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
        </div>
      )}

      {foodAnalysis && (
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 shadow-lg">
          <CardHeader className="bg-amber-200 rounded-t-lg">
            <CardTitle className="text-2xl text-amber-800">{foodAnalysis.name}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-3 text-amber-800">Ingredients:</h4>
              <ul className="list-disc list-inside space-y-1">
                {foodAnalysis.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm text-amber-900">
                    <Markdown>{ingredient}</Markdown>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3 text-amber-800">Preparation Process:</h4>
              <ol className="list-decimal list-inside space-y-2">
                {foodAnalysis.preparationProcess.map((step, index) => (
                  <li key={index} className="text-sm text-amber-900">
                    <Markdown>{step}</Markdown>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
          <CardFooter className="bg-amber-100 rounded-b-lg mt-4">
            <p className="text-xs text-amber-700 italic">Enjoy your delicious meal!</p>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}