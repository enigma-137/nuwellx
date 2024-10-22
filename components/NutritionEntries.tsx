import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NutritionEntriesProps {
  entries: Array<{ id: string; food: string; calories: number; protein: number; carbs: number; fat: number }>
  suggestions: Array<{ suggestion: string; reasoning: string }>
}

export const NutritionEntries: React.FC<NutritionEntriesProps> = ({ entries, suggestions }) => {
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nutrition Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length ? (
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
          ) : (
            <p>No entries yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nutrition Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.length ? (
            <ul className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <p>{suggestion.suggestion}</p>
                  <p className="text-sm">{suggestion.reasoning}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No suggestions available. Add more entries to get personalized recommendations.</p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
