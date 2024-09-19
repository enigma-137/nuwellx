import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') || 'daily'

    let startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    if (view === 'weekly') {
      startDate.setDate(startDate.getDate() - 7)
    } else if (view === 'monthly') {
      startDate.setMonth(startDate.getMonth() - 1)
    }

    const entries = await prisma.nutritionEntry.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error fetching nutrition entries:', error)
    return NextResponse.json({ error: 'Failed to fetch nutrition entries' }, { status: 500 })
  }
}



export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { food, calories, protein, carbs, fat } = await request.json()

    const entry = await prisma.nutritionEntry.create({
      data: {
        userId,
        food,
        calories,
        protein,
        carbs,
        fat,
        date: new Date()
      }
    })

    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Error creating nutrition entry:', error)
    return NextResponse.json({ error: 'Failed to create nutrition entry' }, { status: 500 })
  }
}