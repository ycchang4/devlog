import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'


export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', width: '100%' }}>
  <Sidebar />
  <main className="flex-grow-1 p-4" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
    {children}
  </main>
</div>
  )
}