'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/new',       label: 'New Entry',  icon: '✏️'  },
  { href: '/entries',   label: 'All Entries', icon: '📋' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div
      className="d-flex flex-column"
      style={{
        width: 240,
        minHeight: '100vh',
        padding: '1.5rem 1rem',
        backgroundColor: '#f7f7f5',       // Notion's sidebar gray
        borderRight: '1px solid #e9e9e7', // subtle divider
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div className="mb-4 px-2">
        <h5 className="fw-bold mb-0" style={{ color: '#1a1a1a' }}>DevLog</h5>
        <small style={{ color: '#9b9b9b' }}>Developer Journal</small>
      </div>

      {/* Nav links */}
      <nav className="flex-grow-1">
        <ul className="nav flex-column gap-1">
          {navItems.map(({ href, label, icon }) => (
            <li key={href} className="nav-item">
              <Link
                href={href}
                className="nav-link rounded px-3 py-2 d-flex align-items-center gap-2"
                style={{
                  backgroundColor: pathname === href ? '#e9e9e7' : 'transparent',
                  color: pathname === href ? '#1a1a1a' : '#6b6b6b',
                  fontWeight: pathname === href ? 500 : 400,
                  fontSize: '0.9rem',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info + sign out */}
      <div className="pt-3 mt-3" style={{ borderTop: '1px solid #e9e9e7' }}>
        {session?.user && (
          <div className="d-flex align-items-center gap-2 px-2 mb-3">
            {session.user.image && (
              <img
                src={session.user.image}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-circle"
              />
            )}
            <span className="small text-truncate" style={{ color: '#1a1a1a' }}>
              {session.user.name}
            </span>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="btn btn-sm w-100"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #e9e9e7',
            color: '#6b6b6b',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}