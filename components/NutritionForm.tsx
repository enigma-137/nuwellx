import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

interface NutritionFormProps {
  fetchEntries: () => void
}

export const NutritionForm: React.FC<NutritionFormProps> = ({ fetchEntries }) => {
  const [newEntry, setNewEntry] = useState({ food: '', protein: 0, carbs: 0, fat: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add nutrition entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
                  Total Calories = (Protein * 4) + (Carbs * 4) + (Fat * 9)
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="food" value={newEntry.food} onChange={handleInputChange} placeholder="Food Item" required />
          <Input name="protein" type="number" value={newEntry.protein} onChange={handleInputChange} placeholder="Protein (g)" required />
          <Input name="carbs" type="number" value={newEntry.carbs} onChange={handleInputChange} placeholder="Carbs (g)" required />
          <Input name="fat" type="number" value={newEntry.fat} onChange={handleInputChange} placeholder="Fat (g)" required />

          <div className="flex justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Entry
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
