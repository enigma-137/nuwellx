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
        userId: userId
      },
      orderBy: { createdAt: 'desc' },
      take: 5 // Fetch the last 5 scanned foods
    })

    return NextResponse.json({ foodAnalyses })
  } catch (error) {
    console.error('Error fetching food history:', error)
    return NextResponse.json({ error: 'Failed to fetch food history' }, { status: 500 })
  }
}