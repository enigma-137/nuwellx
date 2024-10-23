'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Info, Plus, Archive } from "lucide-react"
import { NutritionChart } from '@/components/Chart'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from '@/components/ui/progress'
import { UserProfileModal } from '@/components/UserProfileModal'

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

interface NutritionSummary {
  id: string
  startDate: string
  endDate: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  entryCount: number
}

export default function NutritionTracker() {
  const [entries, setEntries] = useState<NutritionEntry[]>([])
  const [newEntry, setNewEntry] = useState({ food: '', protein: 0, carbs: 0, fat: 0 })
  const [suggestions, setSuggestions] = useState<NutritionSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { isLoaded, isSignedIn, user } = useUser()
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [showInputForm, setShowInputForm] = useState(false)
  const [summaries, setSummaries] = useState<NutritionSummary[]>([])
  // const [nutritionGoal, setNutritionGoal] = useState<'maintenance' | 'weight_loss' | 'weight_gain' | null>(null)
  const [recommendedCalories, setRecommendedCalories] = useState(2000)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [targetCalories, setTargetCalories] = useState(2000)
  const { toast } = useToast()

  

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchEntries()
      fetchSummaries()
      fetchUserProfile()
    }
  }, [isLoaded, isSignedIn, viewMode])



  // user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user-profile')
      if (response.data.targetCalories) {
        setTargetCalories(response.data.targetCalories)
        setRecommendedCalories(response.data.targetCalories)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const handleProfileSave = (newTargetCalories: number) => {
    setTargetCalories(newTargetCalories)
    setRecommendedCalories(newTargetCalories)
  }

  // enteries

  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/nutrition-entries?view=${viewMode}`)
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

  // hhsd
  const fetchSummaries = async () => {
    try {
      const response = await axios.get('/api/nutrition-summaries')
      setSummaries(response.data.summaries)
    } catch (error) {
      console.error('Error fetching nutrition summaries:', error)
      toast({
        title: "Error",
        description: "Failed to fetch nutrition summaries. Please try again.",
        variant: "destructive",
      })
    }
  }



  const handleDataManagement = async () => {
    setIsLoading(true)
    try {
      await axios.post('/api/manage-nutrition-data')
      toast({
        title: "Data Management",
        description: "Your nutrition data has been summarized and old entries have been removed.",
      })
      await fetchEntries()
      await fetchSummaries()
    } catch (error) {
      console.error('Error managing nutrition data:', error)
      toast({
        title: "Error",
        description: "Failed to manage nutrition data. Please try again.",
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

  const calculateCalories = (protein: number, carbs: number, fat: number) => {
    return protein * 4 + carbs * 4 + fat * 9
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const calories = calculateCalories(newEntry.protein, newEntry.carbs, newEntry.fat)
    try {
      await axios.post('/api/nutrition-entries', { ...newEntry, calories })
      toast({
        title: "Entry Added",
        description: "Your nutrition entry has been recorded.",
      })
      setNewEntry({ food: '', protein: 0, carbs: 0, fat: 0 })
      await fetchEntries()
      setShowInputForm(false)
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

  const totalNutrition = useMemo(() => {
    return entries.reduce((acc, entry) => {
      acc.calories += entry.calories
      acc.protein += entry.protein
      acc.carbs += entry.carbs
      acc.fat += entry.fat
      return acc
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
  }, [entries])

  // if (!isLoaded || !isSignedIn) {
  //   return <div className='min-h-[75vh] flex items-center justify-center'>Please wait while we check your auth status....</div>


  // }

  // useEffect(() => {
  //   const calories = calculateRecommendedCalories(nutritionGoal)
  //   setRecommendedCalories(calories)
  // }, [nutritionGoal])


  // const calculateRecommendedCalories = (goal: null | 'maintenance' | 'weight_loss' | 'weight_gain') => {
  //   // This is a simplified calculation. later we might consider factors like age, gender, height, weight, and activity level.
  //   switch (goal) {
  //     case 'weight_loss':
  //       return 1800
  //     case 'weight_gain':
  //       return 2500
  //     default:
  //       return 2000
  //   }
  // }



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nutrition Tracker</h1>



      <div className="mb-4 flex flex-col justify-between items-start md:items-center md:flex-row gap-3">
        <Select value={viewMode} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setViewMode(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily View</SelectItem>
            <SelectItem value="weekly">Weekly View</SelectItem>
            <SelectItem value="monthly">Monthly View</SelectItem>
          </SelectContent>
        </Select>
        {/* for goal selection */}
        <Button onClick={() => setIsProfileModalOpen(true)}>
          Set Nutrition Goal
        </Button>

        {/* sd */}
        <Button onClick={() => setShowInputForm(true)} disabled={showInputForm}>
          <Plus className="mr-2 h-4 w-4" /> Add New Entry
        </Button>

        <div className="mb-4 flex justify-center items-center">

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Archive className=" h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will summarize your nutrition data older than one week and remove the detailed entries. This process cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDataManagement} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


        </div>
      </div>

      {showInputForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              What did you eat today?
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Calorie Calculation</DialogTitle>
                    <DialogDescription>
                      Calories are automatically calculated based on the macronutrients you input:
                      <ul className="list-disc list-inside mt-2">
                        <li>1g of Protein = 4 calories</li>
                        <li>1g of Carbohydrates = 4 calories</li>
                        <li>1g of Fat = 9 calories</li>
                      </ul>
                      Total Calories = (Protein * 4) + (Carbs * 4) + (Fat * 9)
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="food" className="block text-sm font-medium ">Food Item</label>
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
                <label htmlFor="protein" className="block text-sm font-medium ">Protein (g)</label>
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
                <label htmlFor="carbs" className="block text-sm font-medium">Carbs (g)</label>
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
                <label htmlFor="fat" className="block text-sm font-medium ">Fat (g)</label>
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

              <div>
                <label className="block text-sm font-medium">Calculated Calories</label>
                <p className="text-lg font-semibold">
                  {calculateCalories(newEntry.protein, newEntry.carbs, newEntry.fat)}
                </p>
              </div>

              <div className="flex justify-between">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Add Entry
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowInputForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

<Card className="mb-6">
        <CardHeader>
          <CardTitle>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Nutrition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Calories</p>
                <div className="flex items-center justify-between">
                  <Progress value={(totalNutrition.calories / recommendedCalories) * 100} className="w-4/5" />
                  <span className="text-sm font-medium">{totalNutrition.calories.toFixed(0)} / {recommendedCalories}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Protein</p>
                <div className="flex items-center justify-between">
                  <Progress value={(totalNutrition.protein / (recommendedCalories * 0.3 / 4)) * 100} className="w-4/5" />
                  <span className="text-sm font-medium">{totalNutrition.protein.toFixed(0)}g / {(recommendedCalories * 0.3 / 4).toFixed(0)}g</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Carbs</p>
                <div className="flex items-center justify-between">
                  <Progress value={(totalNutrition.carbs / (recommendedCalories * 0.5 / 4)) * 100} className="w-4/5" />
                  <span className="text-sm font-medium">{totalNutrition.carbs.toFixed(0)}g / {(recommendedCalories * 0.5 / 4).toFixed(0)}g</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Fat</p>
                <div className="flex items-center justify-between">
                  <Progress value={(totalNutrition.fat / (recommendedCalories * 0.2 / 9)) * 100} className="w-4/5" />
                  <span className="text-sm font-medium">{totalNutrition.fat.toFixed(0)}g / {(recommendedCalories * 0.2 / 9).toFixed(0)}g</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Nutrition Entries</CardTitle>
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Nutrition Intake Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <NutritionChart entries={entries} />
        </CardContent>
      </Card>



      {/* history */}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Historical Nutrition Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          {summaries.length > 0 ? (
            <div className="space-y-4">
              {summaries.map((summary) => (
                <div key={summary.id} className="border-b pb-2">
                  <p className="font-semibold">
                    {new Date(summary.startDate).toLocaleDateString()} - {new Date(summary.endDate).toLocaleDateString()}
                  </p>
                  <p>Total Entries: {summary.entryCount}</p>
                  <p>Average Daily Calories: {(summary.totalCalories / 30).toFixed(2)}</p>
                  <p>Average Daily Protein: {(summary.totalProtein / 30).toFixed(2)}g</p>
                  <p>Average Daily Carbs: {(summary.totalCarbs / 30).toFixed(2)}g</p>
                  <p>Average Daily Fat: {(summary.totalFat / 30).toFixed(2)}g</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No historical summaries available yet.</p>
          )}
        </CardContent>
      </Card>


      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleProfileSave}
      />
    </div>
  )
}