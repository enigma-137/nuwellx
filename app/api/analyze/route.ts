
import { NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/gemini'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { imageData } = await request.json()

  try {
    const analysis = await analyzeImage(imageData)
    
    // Store the analysis in the database
    const storedAnalysis = await prisma.foodAnalysis.create({
      data: { analysis },
    })

    return NextResponse.json({ analysis, id: storedAnalysis.id })
  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }
}