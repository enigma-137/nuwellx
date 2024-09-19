import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goal = await prisma.nutritionGoal.findFirst({
      where: { userId }
    })

    return NextResponse.json({ goal })
  } catch (error) {
    console.error('Error fetching nutrition goal:', error)
    return NextResponse.json({ error: 'Failed to fetch nutrition goal' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { calories, protein, carbs, fat } = await request.json()

    const goal = await prisma.nutritionGoal.upsert({
      where: { userId }, //I dey come
      update: { calories, protein, carbs, fat },
      create: { userId, calories, protein, carbs, fat }
    })

    return NextResponse.json({ goal })
  } catch (error) {
    console.error('Error updating nutrition goal:', error)
    return NextResponse.json({ error: 'Failed to update nutrition goal' }, { status: 500 })
  }
}