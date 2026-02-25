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
      className="d-flex flex-column bg-dark border-end border-secondary"
      style={{ width: 240, minHeight: '100vh', padding: '1.5rem 1rem' }}
    >
      {/* Brand */}
      <div className="mb-4 px-2">
        <h5 className="fw-bold text-white mb-0">DevLog</h5>
        <small className="text-secondary">Developer Journal</small>
      </div>

      {/* Nav links */}
      <nav className="flex-grow-1">
        <ul className="nav flex-column gap-1">
          {navItems.map(({ href, label, icon }) => (
            <li key={href} className="nav-item">
              <Link
                href={href}
                className={`nav-link rounded px-3 py-2 d-flex align-items-center gap-2 ${
                  pathname === href
                    ? 'active bg-primary text-white'
                    : 'text-secondary'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info + sign out */}
      <div className="border-top border-secondary pt-3 mt-3">
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
            <span className="text-white small text-truncate">
              {session.user.name}
            </span>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="btn btn-outline-secondary btn-sm w-100"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}