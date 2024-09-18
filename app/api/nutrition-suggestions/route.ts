
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const entries = await prisma.nutritionEntry.findMany({
      where: {
        userId: userId,
        date: {
          gte: sevenDaysAgo
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    if (entries.length === 0) {
      return NextResponse.json({ suggestions: [] })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Based on the following nutrition entries for the past 7 days, provide 3 suggestions for improving the user's diet. Each suggestion should include a reason. Format the response as a JSON array of objects, each with 'suggestion' and 'reasoning' properties.

    Nutrition Entries:
    ${JSON.stringify(entries, null, 2)}

    Consider factors such as:
    1. Balance of macronutrients (protein, carbs, fat)
    2. Total calorie intake
    3. Variety of foods
    4. Potential nutrient deficiencies
    5. Healthy eating patterns

    Provide the response in the following format:
    [
      {
        "suggestion": "Suggestion 1",
        "reasoning": "Reasoning for suggestion 1"
      },
      {
        "suggestion": "Suggestion 2",
        "reasoning": "Reasoning for suggestion 2"
      },
      {
        "suggestion": "Suggestion 3",
        "reasoning": "Reasoning for suggestion 3"
      }
    ]`

    const result = await model.generateContent(prompt)
    const suggestionsString = result.response.text()

    let suggestions
    try {
      suggestions = JSON.parse(suggestionsString)
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      return NextResponse.json({ error: 'Failed to parse AI suggestions' }, { status: 500 })
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error generating nutrition suggestions:', error)
    return NextResponse.json({ error: 'Failed to generate nutrition suggestions' }, { status: 500 })
  }
}