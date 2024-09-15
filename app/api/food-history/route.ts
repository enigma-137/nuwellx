import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const foodAnalyses = await prisma.foodAnalysis.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10 // Limit to the 10 most recent scans
    })

    return NextResponse.json({ foodAnalyses })
  } catch (error) {
    console.error('Error fetching food history:', error)
    return NextResponse.json({ error: 'Failed to fetch food history' }, { status: 500 })
  }
}