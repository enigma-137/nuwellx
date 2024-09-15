import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const foodAnalyses = await prisma.foodAnalysis.findMany({
      where: {
        userId
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({ foodAnalyses })
  } catch (error) {
    console.error('Error fetching food history:', error)
    return NextResponse.json({ error: 'Failed to fetch food history' }, { status: 500 })
  }
}