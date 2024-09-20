import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userPreference = await prisma.userPreference.findUnique({
    where: { userId },
  })

  if (!userPreference) {
    return NextResponse.json({ hasSeenAIReminder: false })
  }

  return NextResponse.json({ hasSeenAIReminder: userPreference.hasSeenAIReminder })
}

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { hasSeenAIReminder } = await request.json()

  const updatedPreference = await prisma.userPreference.upsert({
    where: { userId },
    update: { hasSeenAIReminder },
    create: { userId, hasSeenAIReminder },
  })

  return NextResponse.json(updatedPreference)
}