import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const imageData = await image.arrayBuffer()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = "Analyze this image and list all the food ingredients you can identify. Provide the list as a comma-separated string."

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: Buffer.from(imageData).toString('base64'),
          mimeType: image.type
        }
      }
    ])

    const ingredientsString = result.response.text()
    const ingredients = ingredientsString.split(',').map(item => item.trim())

    return NextResponse.json({ ingredients })
  } catch (error) {
    console.error('Error recognizing ingredients:', error)
    return NextResponse.json({ error: 'Failed to recognize ingredients' }, { status: 500 })
  }
}