'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface NutritionEntry {
  id: string
  food: string
  calories: number
  protein: number
  carbs: number
  fat: number
  date: string
}

interface NutritionSuggestion {
  suggestion: string
  reasoning: string
}

export default function NutritionTracker() {
  const [entries, setEntries] = useState<NutritionEntry[]>([])
  const [newEntry, setNewEntry] = useState({ food: '', calories: 0, protein: 0, carbs: 0, fat: 0 })
  const [suggestions, setSuggestions] = useState<NutritionSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { isLoaded, isSignedIn, user } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchEntries()
    }
  }, [isLoaded, isSignedIn])

  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/nutrition-entries')
      setEntries(response.data.entries)
      if (response.data.entries.length > 0) {
        fetchSuggestions()
      }
    } catch (error) {
      console.error('Error fetching nutrition entries:', error)
      toast({
        title: "Error",
        description: "Failed to fetch nutrition entries. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get('/api/nutrition-suggestions')
      setSuggestions(response.data.suggestions)
    } catch (error) {
      console.error('Error fetching nutrition suggestions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch nutrition suggestions. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEntry(prev => ({ ...prev, [name]: name === 'food' ? value : Number(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axios.post('/api/nutrition-entries', newEntry)
      toast({
        title: "Entry Added",
        description: "Your nutrition entry has been recorded.",
      })
      setNewEntry({ food: '', calories: 0, protein: 0, carbs: 0, fat: 0 })
      await fetchEntries()
    } catch (error) {
      console.error('Error adding nutrition entry:', error)
      toast({
        title: "Error",
        description: "Failed to add nutrition entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded || !isSignedIn) {
    return <div>Please sign in to track your nutrition.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nutrition Tracker</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What did you eat today?</CardTitle>
        </CardHeader>
        <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label htmlFor="food" className="block text-sm font-medium text-gray-700">Food Item</label>
    <Input
      id="food"
      name="food"
      value={newEntry.food}
      onChange={handleInputChange}
      placeholder="Food Item"
      required
    />
  </div>

  <div>
    <label htmlFor="calories" className="block text-sm font-medium text-gray-700">Calories</label>
    <Input
      id="calories"
      name="calories"
      type="number"
      value={newEntry.calories}
      onChange={handleInputChange}
      placeholder="Calories"
      required
    />
  </div>

  <div>
    <label htmlFor="protein" className="block text-sm font-medium text-gray-700">Protein (g)</label>
    <Input
      id="protein"
      name="protein"
      type="number"
      value={newEntry.protein}
      onChange={handleInputChange}
      placeholder="Protein (g)"
      required
    />
  </div>

  <div>
    <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">Carbs (g)</label>
    <Input
      id="carbs"
      name="carbs"
      type="number"
      value={newEntry.carbs}
      onChange={handleInputChange}
      placeholder="Carbs (g)"
      required
    />
  </div>

  <div>
    <label htmlFor="fat" className="block text-sm font-medium text-gray-700">Fat (g)</label>
    <Input
      id="fat"
      name="fat"
      type="number"
      value={newEntry.fat}
      onChange={handleInputChange}
      placeholder="Fat (g)"
      required
    />
 </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Entry
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Today's Nutrition</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map(entry => (
                <div key={entry.id} className="flex justify-between items-center">
                  <span>{entry.food}</span>
                  <span>
                    {entry.calories} cal | P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nutrition Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.length > 0 ? (
            <ul className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <p className="font-semibold">{suggestion.suggestion}</p>
                  <p className="text-sm text-gray-600">{suggestion.reasoning}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No suggestions available. Add more entries to get personalized recommendations.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}