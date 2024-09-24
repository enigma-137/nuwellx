// 'use client'

// import React from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// interface FoodData {
//   food_name: string
//   brand_name?: string
//   serving_qty?: number
//   serving_unit?: string
//   nf_calories?: number
//   nf_total_fat?: number
//   nf_total_carbohydrate?: number
//   nf_protein?: number
//   servings?: {
//     serving: {
//       serving_description?: string
//       calories?: number
//     }
//   }
// }

// interface FoodDetailsProps {
//   food: FoodData
//   onAddToHistory: () => void
// }

// export function FoodDetails({ food, onAddToHistory }: FoodDetailsProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{food.food_name}</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-2">
//         {food.brand_name && <p><strong>Brand:</strong> {food.brand_name}</p>}
        
//         <p>
//           <strong>Serving Size:</strong>{' '}
//           {food.servings?.serving?.serving_description || 
//            `${food.serving_qty || ''} ${food.serving_unit || ''}`.trim() || 
//            'Not specified'}
//         </p>
        
//         <p>
//           <strong>Calories:</strong>{' '}
//           {food.servings?.serving?.calories || food.nf_calories || 'Not specified'} kcal
//         </p>
        
//         {food.nf_total_fat !== undefined && (
//           <p><strong>Total Fat:</strong> {food.nf_total_fat}g</p>
//         )}
        
//         {food.nf_total_carbohydrate !== undefined && (
//           <p><strong>Total Carbohydrates:</strong> {food.nf_total_carbohydrate}g</p>
//         )}
        
//         {food.nf_protein !== undefined && (
//           <p><strong>Protein:</strong> {food.nf_protein}g</p>
//         )}
//       </CardContent>
//       <CardFooter>
//         <Button onClick={onAddToHistory}>Add to Food History</Button>
//       </CardFooter>
//     </Card>
//   )
// }