

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { userId } = auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get the date one month ago
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    // Summarize data older than one month
    const summarizedData = await prisma.nutritionEntry.groupBy({
      by: ['userId'],
      where: {
        userId: userId,
        date: {
          lt: oneMonthAgo
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
      // Create a summary entry
      await prisma.nutritionSummary.create({
        data: {
          userId: userId,
          startDate: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth(), 1),
          endDate: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth() + 1, 0),
          totalCalories: summarizedData[0]._sum.calories || 0,
          totalProtein: summarizedData[0]._sum.protein || 0,
          totalCarbs: summarizedData[0]._sum.carbs || 0,
          totalFat: summarizedData[0]._sum.fat || 0,
          entryCount: summarizedData[0]._count.id || 0,
        }
      })

      console.log("Deleting old entries")

      // Delete the old entries
      await prisma.nutritionEntry.deleteMany({
        where: {
          userId: userId,
          date: {
            lt: oneMonthAgo
          }
        }
      })
    }

    return NextResponse.json({ message: 'Data management completed successfully' })
  } catch (error) {
    console.error('Error managing nutrition data:', error)
    return NextResponse.json({ error: 'Failed to manage nutrition data' }, { status: 500 })
  }
}