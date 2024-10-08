// pages/api/manage-nutrition-data.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req)
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
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

      if (summarizedData.length > 0) {
        
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

      res.status(200).json({ message: 'Data management completed successfully' })
    } catch (error) {
      console.error('Error managing nutrition data:', error)
      res.status(500).json({ error: 'Failed to manage nutrition data' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}