import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const moodColors: Record<string, string> = {
  '🔥 Productive': 'bg-success',
  '🎉 Excited': 'bg-info',
  '😐 Neutral': 'bg-warning',
  '😓 Struggling': 'bg-danger',
}

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) redirect('/')

  const entry = await prisma.entry.findUnique({
    where: { id },
  })

  if (!entry) notFound()
  if (entry.userId !== user.id) notFound()

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>

      {/* Back button */}
      <Link
        href="/entries"
        className="btn btn-sm d-inline-flex align-items-center gap-1 mb-4"
        style={{
          border: '1px solid #c0c0bc',
          color: '#1a1a1a',
          backgroundColor: '#ffffff',
          fontWeight: 600,
          borderRadius: '6px',
        }}
      >
        ← All Entries
      </Link>

      {/* Document card */}
      <div
        className="rounded-3 p-4 p-md-5"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e9e9e7',
        }}
      >
        {/* Metadata row */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <small style={{ color: '#9b9b9b' }}>{formatDate(entry.createdAt)}</small>
          {entry.mood && (
            <span className={`badge ${moodColors[entry.mood] ?? 'bg-secondary'}`}>
              {entry.mood}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className="fw-bold mb-4"
          style={{ fontSize: '1.8rem', letterSpacing: '-0.02em', color: '#1a1a1a' }}
        >
          {entry.title}
        </h1>

        {/* Divider */}
        <hr style={{ borderColor: '#e9e9e7', marginBottom: '1.5rem' }} />

        {/* Content */}
        <p
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: '1.9',
            color: '#374151',
            fontSize: '1rem',
          }}
        >
          {entry.content}
        </p>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div
            className="d-flex gap-2 flex-wrap mt-4 pt-3"
            style={{ borderTop: '1px solid #e9e9e7' }}
          >
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="badge"
                style={{
                  backgroundColor: '#f0f0ee',
                  color: '#6b6b6b',
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  padding: '0.35em 0.75em',
                  borderRadius: '999px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}