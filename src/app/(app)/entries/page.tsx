// No 'use client' — this is a Server Component.
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const moodColors: Record<string, string> = {
  '🔥 Productive': 'bg-success',
  '🎉 Excited': 'bg-info',
  '😐 Neutral': 'bg-warning',
  '😓 Struggling': 'bg-danger',
}

export default async function EntriesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) redirect('/')

  const entries = await prisma.entry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container py-4" style={{ maxWidth: '900px'  }}>

      {/* Page header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0" style={{ color: '#1a1a1a' }}>My Entries</h1>
          <small style={{ color: '#9b9b9b' }}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</small>
        </div>
        <Link
          href="/new"
          className="btn btn-sm"
          style={{
          border: '1px solid #c0c0bc',
          color: '#1a1a1a',
          backgroundColor: '#ffffff',
          fontWeight: 600,
          borderRadius: '6px',
        }}
        >
          + New Entry
        </Link>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="text-center py-5" style={{ color: '#9b9b9b' }}>
          <p className="fs-5">No entries yet.</p>
          <Link href="/new" className="btn btn-sm btn-outline-secondary">
            Write your first entry
          </Link>
        </div>
      )}

      {/* Entry cards */}
      <div className="d-flex flex-column gap-2">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/entries/${entry.id}`}
            className="text-decoration-none"
          >
            <div
              className="rounded-3 px-4 py-3 hover-card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e9e9e7',
                transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
              }}
            >
              {/* Top row: title + mood badge */}
              <div className="d-flex justify-content-between align-items-start mb-1">
                <h5 className="mb-0 fw-semibold" style={{ color: '#1a1a1a', fontSize: '0.95rem' }}>
                  {entry.title}
                </h5>
                {entry.mood && (
                  <span className={`badge ${moodColors[entry.mood] ?? 'bg-secondary'} ms-2`}>
                    {entry.mood}
                  </span>
                )}
              </div>

              {/* Content preview */}
              <p className="mb-2 small" style={{ color: '#6b6b6b' }}>
                {entry.content.length > 150
                  ? entry.content.slice(0, 150) + '...'
                  : entry.content}
              </p>

              {/* Bottom row: tags + date */}
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-1 flex-wrap">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge"
                      style={{
                        backgroundColor: '#f0f0ee',
                        color: '#6b6b6b',
                        fontWeight: 400,
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        padding: '0.25em 0.65em',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <small style={{ color: '#9b9b9b' }}>{formatDate(entry.createdAt)}</small>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}