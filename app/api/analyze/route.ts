import { NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/gemini'

export async function POST(request: Request) {
  const { imageData } = await request.json()

  try {
    const analysis = await analyzeImage(imageData)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing image:', error)
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 })
  }
}