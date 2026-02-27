import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'
import { getWeekStart } from '@/lib/utils'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function getWeeklySummary(userId: string): Promise<string> {
  const weekStart = getWeekStart(new Date())

  // 1. Check cache first
  const cached = await prisma.weeklySummary.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  })
  if (cached) return cached.summary

  // 2. Fetch this week's entries (Mon 00:00 UTC → now)
  const entries = await prisma.entry.findMany({
    where: {
      userId,
      createdAt: { gte: weekStart },
    },
    orderBy: { createdAt: 'asc' },
    select: { title: true, content: true, mood: true, createdAt: true },
  })

  // 3. No entries this week — return early, don't call OpenAI
  if (entries.length === 0) {
    return 'No entries this week yet. Start journaling to get your weekly summary!'
  }

  // 4. Build the prompt
  const entryText = entries.map((e, i) => {
    const date = e.createdAt.toISOString().slice(0, 10)
    return `Entry ${i + 1} (${date}${e.mood ? `, mood: ${e.mood}` : ''}):\nTitle: ${e.title}\n${e.content}`
  }).join('\n\n---\n\n')

  const prompt = `You are summarizing a developer's journal entries for the week.

Given the entries below, provide:
1. A 2-3 sentence TL;DR of the week
2. Key accomplishments (bullet points, max 5)
3. Provide one motivational quote related to the accomplishment entries for the week.


Be concise and encouraging. Make it sound personal. Use plain text only — no markdown headers.


Entries:

${entryText}`

  // 5. Call OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  })

  const summary = completion.choices[0]?.message?.content?.trim() ?? 'Could not generate summary.'

  // 6. Save to DB so we don't call OpenAI again this week
  // Use upsert to handle race conditions in dev mode (double renders)
  await prisma.weeklySummary.upsert({
    where: { userId_weekStart: { userId, weekStart } },
    create: { userId, weekStart, summary },
    update: { summary },
  })

  return summary
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) redirect('/')

  // Fetch all entries for heatmap/stats
  const entries = await prisma.entry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true, mood: true },
  })

  // --- Compute stats ---
  const todayStr = new Date().toISOString().slice(0, 10)
  const totalEntries = entries.length

  const entryDates = new Set(entries.map((e: { createdAt: Date; mood: string | null }) => e.createdAt.toISOString().slice(0, 10)))
  let streak = 0
  const cursor = new Date()
  while (true) {
    const dateStr = cursor.toISOString().slice(0, 10)
    if (entryDates.has(dateStr)) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  const moodCounts: Record<string, number> = {}
  for (const entry of entries) {
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] ?? 0) + 1
    }
  }

  const heatmapMap: Record<string, { count: number; moods: string[] }> = {}
  for (const entry of entries) {
    const date = entry.createdAt.toISOString().slice(0, 10)
    if (!heatmapMap[date]) heatmapMap[date] = { count: 0, moods: [] }
    heatmapMap[date].count++
    if (entry.mood) heatmapMap[date].moods.push(entry.mood)
  }

  // Fetch or generate weekly summary
  const weeklySummary = await getWeeklySummary(user.id)

  return (
      <DashboardClient
          totalEntries={totalEntries}
          streak={streak}
          moodCounts={moodCounts}
          heatmapMap={heatmapMap}
          today={todayStr}
          weeklySummary={weeklySummary}
      />
  )
}