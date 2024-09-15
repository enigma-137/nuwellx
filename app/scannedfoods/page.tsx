'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"



interface FoodAnalysis {
  id: string
  analysis: string
  createdAt: string
}

export default function FoodHistory() {
  const [foodHistory, setFoodHistory] = useState<FoodAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFoodHistory = async () => {
      try {
        const response = await axios.get('/api/food-history')
        setFoodHistory(response.data.foodAnalyses)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching food history:', error)
        setError('Failed to load food history. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchFoodHistory()
  }, [])

  if (isLoading) return <div className='h-screen items-center justify-center flex'>Loading food history...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Previously Scanned Foods</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {foodHistory.length === 0 ? (
            <p>No food scans available yet.</p>
          ) : (
            foodHistory.map((food) => (
              <div key={food.id} className="mb-4 p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">
                  Scanned on: {new Date(food.createdAt).toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">{food.analysis}</p>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}