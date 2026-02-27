import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getWeekStart } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, content, mood, tags } = body

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json(
        { error: 'Title and content are required.' },
        { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  const entry = await prisma.entry.create({
    data: {
      title:   title.trim(),
      content: content.trim(),
      mood:    mood  ?? null,
      tags:    tags  ?? [],
      userId:  user.id,
    },
  })

  // Invalidate this week's cached summary so it regenerates on next dashboard load
  const weekStart = getWeekStart(entry.createdAt)
  await prisma.weeklySummary.deleteMany({
    where: { userId: user.id, weekStart },
  })

  return NextResponse.json(entry, { status: 201 })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  const entries = await prisma.entry.findMany({
    where:   { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(entries)
}