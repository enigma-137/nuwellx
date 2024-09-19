'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FoodItem {
  name: string
  protein: number
  carbs: number
  fat: number
}

export function CalorieCalculator() {
  const [foodItem, setFoodItem] = useState<FoodItem>({ name: '', protein: 0, carbs: 0, fat: 0 })
  const [calories, setCalories] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFoodItem(prev => ({ ...prev, [name]: name === 'name' ? value : Number(value) }))
  }

  const calculateCalories = () => {
    const { protein, carbs, fat } = foodItem
    const totalCalories = (protein * 4) + (carbs * 4) + (fat * 9)
    setCalories(Math.round(totalCalories))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">Don't know how to calculate calories? Click here</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-sky-200">
        <DialogHeader>
          <DialogTitle>Calorie Calculator</DialogTitle>
          <DialogDescription>
            Enter the macronutrients to calculate the total calories.
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Food Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={foodItem.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="protein" className="text-right">
                  Protein (g)
                </Label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  value={foodItem.protein}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="carbs" className="text-right">
                  Carbs (g)
                </Label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  value={foodItem.carbs}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fat" className="text-right">
                  Fat (g)
                </Label>
                <Input
                  id="fat"
                  name="fat"
                  type="number"
                  value={foodItem.fat}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={calculateCalories} className="mt-4 w-full">
              Calculate Calories
            </Button>
            {calories !== null && (
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">Total Calories: {calories}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}