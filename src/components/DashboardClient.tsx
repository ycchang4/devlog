'use client'
import { useState } from 'react'

interface HeatmapDay {
  count: number
  moods: string[]
}

interface Props {
  totalEntries: number
  streak: number
  moodCounts: Record<string, number>
  heatmapMap: Record<string, HeatmapDay>
  today: string
  weeklySummary: string
}

function getCellColor(count: number): string {
  if (count === 0) return '#ebedf0'
  if (count === 1) return '#c6e48b'
  if (count === 2) return '#7bc96f'
  if (count === 3) return '#239a3b'
  return '#196127'
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildGrid(today: string): string[][] {
  const end = new Date(today)
  const start = new Date(end)
  start.setDate(start.getDate() - 364)
  start.setDate(start.getDate() - start.getDay())
  const weeks: string[][] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    const week: string[] = []
    for (let d = 0; d < 7; d++) {
      week.push(cursor.toISOString().slice(0, 10))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

function getMonthLabels(weeks: string[][]): { label: string; index: number }[] {
  const labels: { label: string; index: number }[] = []
  let lastMonth = -1
  let lastIndex = -4 // minimum gap between labels (in columns)
  weeks.forEach((week, i) => {
    // Use day index 1 (Monday) so the label aligns with the first full week of the month
    const month = new Date(week[1] ?? week[0]).getMonth()
    if (month !== lastMonth && i - lastIndex >= 4) {
      labels.push({ label: MONTHS[month], index: i })
      lastMonth = month
      lastIndex = i
    }
  })
  return labels
}

export default function DashboardClient({ totalEntries, streak, moodCounts, heatmapMap, today, weeklySummary }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  const weeks = buildGrid(today)
  const monthLabels = getMonthLabels(weeks)
  const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0)

  return (
      <div className="container py-4" style={{ maxWidth: '900px' }}>

        <h2 className="fw-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Dashboard</h2>
        <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>Your journaling activity at a glance</p>

        {/* Stat cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="rounded-3 p-3 h-100" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{totalEntries}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Total Entries</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="rounded-3 p-3 h-100" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{streak} 🔥</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Day Streak</div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="rounded-3 p-4 mb-4" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', overflowX: 'auto' }}>
          <h6 className="fw-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Entries over the last 12 months</h6>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ display: 'flex', marginLeft: 28, marginBottom: 4 }}>
              {monthLabels.map(({ label, index }) => (
                  <div key={label + index} style={{ position: 'absolute', left: 28 + index * 13, fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    {label}
                  </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 2, marginTop: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 4 }}>
                {DAYS.map((day, i) => (
                    <div key={day} style={{ height: 11, fontSize: '0.6rem', color: 'var(--color-text-muted)', lineHeight: '11px', visibility: i % 2 === 0 ? 'visible' : 'hidden' }}>
                      {day}
                    </div>
                ))}
              </div>
              {weeks.map((week, wi) => (
                  <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {week.map((date) => {
                      const day = heatmapMap[date]
                      const count = day?.count ?? 0
                      const moods = day?.moods ?? []
                      const isToday = date === today
                      return (
                          <div
                              key={date}
                              onMouseEnter={e => {
                                const rect = (e.target as HTMLElement).getBoundingClientRect()
                                const moodStr = moods.length > 0 ? ` · ${moods.join(', ')}` : ''
                                setTooltip({
                                  text: count === 0 ? `${date}: no entries` : `${date}: ${count} entr${count === 1 ? 'y' : 'ies'}${moodStr}`,
                                  x: rect.left + window.scrollX,
                                  y: rect.top + window.scrollY - 28,
                                })
                              }}
                              onMouseLeave={() => setTooltip(null)}
                              style={{ width: 11, height: 11, borderRadius: 2, backgroundColor: getCellColor(count), outline: isToday ? '2px solid var(--color-text-primary)' : 'none', cursor: count > 0 ? 'pointer' : 'default' }}
                          />
                      )
                    })}
                  </div>
              ))}
            </div>
          </div>
          <div className="d-flex align-items-center gap-1 mt-3" style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            <span>Less</span>
            {['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'].map(c => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: 2, backgroundColor: c }} />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Mood breakdown */}
        {totalMoods > 0 && (
            <div className="rounded-3 p-4 mb-4" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
              <h6 className="fw-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Mood Breakdown</h6>
              <div className="d-flex flex-column gap-2">
                {Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).map(([mood, count]) => (
                    <div key={mood} className="d-flex align-items-center gap-2">
                      <div style={{ width: 120, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{mood}</div>
                      <div style={{ flex: 1, height: 8, backgroundColor: '#ebedf0', borderRadius: 999 }}>
                        <div style={{ height: '100%', width: `${(count / totalMoods) * 100}%`, backgroundColor: 'var(--color-text-primary)', borderRadius: 999, transition: 'width 0.4s ease' }} />
                      </div>
                      <div style={{ width: 30, fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>{count}</div>
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* Weekly Summary */}
        <div className="rounded-3 p-4" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <h6 className="fw-semibold mb-0" style={{ color: 'var(--color-text-primary)' }}>Weekly Summary</h6>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-sidebar)', border: '1px solid var(--color-border)', borderRadius: 999, padding: '2px 8px' }}>
            AI · This week
          </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
            {weeklySummary}
          </p>
        </div>

        {/* Tooltip */}
        {tooltip && (
            <div style={{ position: 'fixed', left: tooltip.x, top: tooltip.y, backgroundColor: 'var(--color-text-primary)', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 9999 }}>
              {tooltip.text}
            </div>
        )}
      </div>
  )
}