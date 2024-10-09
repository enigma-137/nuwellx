import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const { userId } = auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const summaries = await prisma.nutritionSummary.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    return NextResponse.json({ summaries })
  } catch (error) {
    console.error('Error fetching nutrition summaries:', error)
    return NextResponse.json({ error: 'Failed to fetch nutrition summaries' }, { status: 500 })
  }
}