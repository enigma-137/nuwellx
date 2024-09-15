import { NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/gemini'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  const { userId } = auth()
    
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { imageData } = await request.json()

  try {
    const analysis = await analyzeImage(imageData)
    
    const storedAnalysis = await prisma.foodAnalysis.create({
      data: {
        analysis,
        userId
      },
    })

    return NextResponse.json({ analysis, id: storedAnalysis.id })
  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }
}