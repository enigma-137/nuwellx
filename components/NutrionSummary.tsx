import React, { useMemo } from 'react'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NutritionSummaryProps {
  entries: Array<{ calories: number; protein: number; carbs: number; fat: number }>
  recommendedCalories: number
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({ entries, recommendedCalories }) => {
  const totalNutrition = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.calories += entry.calories
        acc.protein += entry.protein
        acc.carbs += entry.carbs
        acc.fat += entry.fat
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    )
  }, [entries])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Daily Nutrition Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p>Calories</p>
          <Progress value={(totalNutrition.calories / recommendedCalories) * 100} />
          <p>{totalNutrition.calories} / {recommendedCalories} kcal</p>
        </div>
        <div>
          <p>Protein</p>
          <Progress value={(totalNutrition.protein / (recommendedCalories * 0.3 / 4)) * 100} />
          <p>{totalNutrition.protein}g</p>
        </div>
        <div>
          <p>Carbs</p>
          <Progress value={(totalNutrition.carbs / (recommendedCalories * 0.5 / 4)) * 100} />
          <p>{totalNutrition.carbs}g</p>
        </div>
        <div>
          <p>Fat</p>
          <Progress value={(totalNutrition.fat / (recommendedCalories * 0.2 / 9)) * 100} />
          <p>{totalNutrition.fat}g</p>
        </div>
      </CardContent>
    </Card>
  )
}
