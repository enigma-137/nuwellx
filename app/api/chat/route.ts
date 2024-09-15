import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from '@/lib/prisma'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { message, history } = await request.json()

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Fetch the most recent food analysis
    const recentAnalysis = await prisma.foodAnalysis.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    let initialPrompt = "You are an AI dietician. Provide helpful and accurate dietary advice. ";
    if (recentAnalysis) {
      initialPrompt += `Consider this previous food analysis when giving advice: ${recentAnalysis.analysis}`;
    }

    // Format the chat history correctly for Gemini API
    const formattedHistory = history.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: initialPrompt }] },
        { role: 'model', parts: [{ text: "Understood. I'll act as an AI dietician and provide helpful dietary advice based on the information available, including any previous food analysis." }] },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    // Store the chat message
    await prisma.chatMessage.create({
      data: {
        role: 'user',
        content: message,
      },
    })

    const assistantResponse = response.text();
    await prisma.chatMessage.create({
      data: {
        role: 'assistant',
        content: assistantResponse,
      },
    })

    return NextResponse.json({ reply: assistantResponse })
  } catch (error) {
    console.error('Error in chat:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to get response: ${error.message}` }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
}