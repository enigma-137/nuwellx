'use client'

import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface NutritionChartProps {
  entries: Array<{
    date: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }>
}

export function NutritionChart({ entries }: NutritionChartProps) {
  const dates = entries.map(entry => new Date(entry.date).toLocaleDateString())
  const calories = entries.map(entry => entry.calories)
  const protein = entries.map(entry => entry.protein)
  const carbs = entries.map(entry => entry.carbs)
  const fat = entries.map(entry => entry.fat)

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Calories',
        data: calories,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Protein',
        data: protein,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Carbs',
        data: carbs,
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
      {
        label: 'Fat',
        data: fat,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Nutrition Intake Over Time',
      },
    },
  }

  return <Line options={options} data={data} />
}