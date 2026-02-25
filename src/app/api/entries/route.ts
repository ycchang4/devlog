import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  // Step 1: make sure the user is logged in
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Step 2: read the JSON body the form sent us
  const body = await req.json()
  const { title, content, mood, tags } = body

  // Step 3: validate — don't trust the client to send correct data
  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: 'Title and content are required.' },
      { status: 400 }
    )
  }

  // Step 4: find the user in our database using their email from the session
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  // Step 5: create the entry in the database
  const entry = await prisma.entry.create({
    data: {
      title:   title.trim(),
      content: content.trim(),
      mood:    mood  ?? null,
      tags:    tags  ?? [],
      userId:  user.id,
    },
  })

  // Step 6: send the saved entry back as JSON
  return NextResponse.json(entry, { status: 201 })
}

export async function GET() {
  // Step 1: make sure the user is logged in
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Step 2: find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  // Step 3: fetch only this user's entries, newest first
  const entries = await prisma.entry.findMany({
    where:   { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(entries)
}