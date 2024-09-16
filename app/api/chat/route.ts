import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, history } = await request.json()

    // Fetch recent food scans
    const recentFoodScans = await prisma.foodAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let initialPrompt = "You are an AI dietician. Provide helpful and accurate dietary advice. ";
    
    if (recentFoodScans.length > 0) {
      initialPrompt += "Here are the user's recent food scans:\n";
      recentFoodScans.forEach((scan, index) => {
        initialPrompt += `Scan ${index + 1}: ${scan.analysis}\n`;
      });
      initialPrompt += "Please consider this information when providing advice.";
    } else {
      initialPrompt += "The user has no recent food scans.";
    }

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: initialPrompt }] },
        { role: 'model', parts: [{ text: "Understood. I'll act as an AI dietician and provide helpful dietary advice based on the information available, including any recent food scans." }] },
        ...history.map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }))
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
        userId: userId,
      },
    })

    const assistantResponse = response.text();
    await prisma.chatMessage.create({
      data: {
        role: 'assistant',
        content: assistantResponse,
        userId: userId,
      },
    })

    return NextResponse.json({ reply: assistantResponse })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 })
  }
}