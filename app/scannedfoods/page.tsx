'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from 'react-markdown'
import { Loader2 } from 'lucide-react'

interface FoodAnalysis {
  id: string
  analysis: string
  createdAt: string
}

export default function FoodHistory() {
  const [foodHistory, setFoodHistory] = useState<FoodAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isLoaded, isSignedIn, user } = useUser()
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchFoodHistory = async () => {
      if (!isLoaded || !isSignedIn) {
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get('/api/food-history')
        setFoodHistory(response.data.foodAnalyses)
      } catch (error) {
        console.error('Error fetching food history:', error)
        setError('Failed to load food history. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFoodHistory()
  }, [isLoaded, isSignedIn])

  if (!isLoaded || isLoading) {
    return <div className='h-screen items-center justify-center flex'> 
    <span><Loader2 className='animate-spin'/></span>
    Loading food history...</div>
  }

  if (!isSignedIn) {
    return <div className='h-screen items-center justify-center flex'>Please sign in to view your food history.</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
  }



  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Food History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {foodHistory.length === 0 ? (
            <p className='h-fit items-center justify-center'>No food scans available yet.</p>
          ) : (
            foodHistory.map((food) => (
              <div key={food.id} className="mb-4 p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">
                  Scanned on: {new Date(food.createdAt).toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">
                  {expandedItems[food.id] ? (
                    <ReactMarkdown>{food.analysis}</ReactMarkdown>
                  ) : (
                    <ReactMarkdown>{truncateText(food.analysis, 100)}</ReactMarkdown>
                  )}
                </p>
                <button 
                  onClick={() => toggleExpand(food.id)} 
                  className="text-blue-500 text-sm">
                  {expandedItems[food.id] ? 'View Less' : 'View More'}
                </button>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
