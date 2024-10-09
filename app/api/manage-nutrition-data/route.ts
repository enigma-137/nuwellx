// app/api/manage-nutrition-data/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  console.log("Manage nutrition data route hit")
  const { userId } = auth()
  
  if (!userId) {
    console.log("Unauthorized access attempt")
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get the date one week ago
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    console.log("Fetching data to summarize")
    const summarizedData = await prisma.nutritionEntry.groupBy({
      by: ['userId'],
      where: {
        userId: userId,
        date: {
          lt: oneWeekAgo
        }
      },
      _sum: {
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
      },
      _count: {
        id: true
      }
    })

    console.log("Summarized data:", summarizedData)

    if (summarizedData.length > 0) {
      console.log("Creating summary entry")
      await prisma.nutritionSummary.create({
        data: {
          userId: userId,
          startDate: new Date(oneWeekAgo.getFullYear(), oneWeekAgo.getMonth(), oneWeekAgo.getDate() - 6), // Start of the week
          endDate: oneWeekAgo,
          totalCalories: summarizedData[0]._sum.calories || 0,
          totalProtein: summarizedData[0]._sum.protein || 0,
          totalCarbs: summarizedData[0]._sum.carbs || 0,
          totalFat: summarizedData[0]._sum.fat || 0,
          entryCount: summarizedData[0]._count.id || 0,
        }
      })

      console.log("Deleting old entries")
      const deleteResult = await prisma.nutritionEntry.deleteMany({
        where: {
          userId: userId,
          date: {
            lt: oneWeekAgo
          }
        }
      })
      console.log("Deleted entries count:", deleteResult.count)
    } else {
      console.log("No data to summarize")
    }

    return NextResponse.json({ message: 'Data management completed successfully' })
  } catch (error) {
    console.error('Error managing nutrition data:', error)
    return NextResponse.json({ error: 'Failed to manage nutrition data' }, { status: 500 })
  }
}