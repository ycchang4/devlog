'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  if (session) {
    router.push('/dashboard')
  }

  return (
    <div className="container mt-5">
      <h2>DevLog</h2>
      <button
        className="btn btn-dark mt-3"
        onClick={() => signIn('github') }
      >
        Sign in with GitHub
      </button>
    </div>
  )
}