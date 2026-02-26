// Server Component — fetches data and computes stats
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) redirect('/')

  // Fetch all entries for this user
  const entries = await prisma.entry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true, mood: true },
  })

  // --- Compute stats ---

  // 1. Total entries
  const totalEntries = entries.length

  // 2. Current streak — how many consecutive days ending today have an entry
  const todayStr = new Date().toISOString().slice(0, 10)
  const entryDates = new Set(entries.map(e => e.createdAt.toISOString().slice(0, 10)))

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

  // 3. Mood breakdown — count each mood
  const moodCounts: Record<string, number> = {}
  for (const entry of entries) {
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] ?? 0) + 1
    }
  }

  // 4. Heatmap data — map each date string to { count, moods[] }
  const heatmapMap: Record<string, { count: number; moods: string[] }> = {}
  for (const entry of entries) {
    const date = entry.createdAt.toISOString().slice(0, 10)
    if (!heatmapMap[date]) heatmapMap[date] = { count: 0, moods: [] }
    heatmapMap[date].count++
    if (entry.mood) heatmapMap[date].moods.push(entry.mood)
  }

  return (
    <DashboardClient
      totalEntries={totalEntries}
      streak={streak}
      moodCounts={moodCounts}
      heatmapMap={heatmapMap}
      today={todayStr}
    />
  )
}