'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from 'react-markdown'
import { Loader2, Camera } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

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
    return (
      <div className='h-screen flex items-center justify-center'> 
        Loading food history <Loader2 className='animate-spin ml-2'/>
      </div>
    )
  }

  if (!isSignedIn) {
    return <div className='h-screen flex items-center justify-center'>Please sign in to view your food history.</div>
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
    <Card className="w-full min-h-[90vh] max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Scanned Food</CardTitle>
        <CardDescription>View and analyze your past food scans</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md p-1">
          {foodHistory.length === 0 ? (
            <div className="text-center">
              <p className='mb-4'>No food scans available yet.</p>
              <p className='mb-4'>Start by scanning a food item to build your history!</p>
              <Link href="/scan">
                <Button>
                  <Camera className="mr-2 h-4 w-4" /> Scan Food
                </Button>
              </Link>
            </div>
          ) : (
            foodHistory.map((food) => (
              <div key={food.id} className="mb-4 p-2 border rounded-lg">
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
                  className="text-blue-500 text-sm mt-2">
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