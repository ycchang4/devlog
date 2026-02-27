import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SignInButton from '@/components/SignInButton'

export default async function LandingPage() {
    const session = await getServerSession(authOptions)
    if (session) redirect('/dashboard')

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fafaf9', fontFamily: 'Inter, system-ui, sans-serif' }}>

            {/* Nav */}
            <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e9e9e7' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a', letterSpacing: '-0.3px' }}>
          DevLog
        </span>
                <SignInButton />
            </nav>

            {/* Hero */}
            <section style={{ maxWidth: 680, margin: '0 auto', padding: '96px 24px 80px', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', fontSize: '0.78rem', fontWeight: 500, color: '#6b6b6b', backgroundColor: '#f0f0ee', border: '1px solid #e9e9e7', borderRadius: 999, padding: '4px 14px', marginBottom: 28, letterSpacing: '0.3px' }}>
                    git commit -m 'finally figured it out'
                </div>

                <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 24 }}>
                    Your progress deserves<br />
                    <span style={{ color: '#5b7fa6' }}>to be remembered.</span>
                </h1>

                <p style={{ fontSize: '1.1rem', color: '#6b6b6b', lineHeight: 1.8, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
                    DevLog helps you capture what you built, what you learned, and how you felt, so you can look back and see how far you've come.
                </p>

                <SignInButton large />

                <p style={{ marginTop: 16, fontSize: '0.8rem', color: '#9b9b9b' }}>
                    Sign in with GitHub · Free to use
                </p>
            </section>

            {/* Features */}
            <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 96px' }}>

                <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 500, color: '#9b9b9b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 48 }}>
                    Everything you need to stay grounded
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>

                    {[
                        {
                            icon: '📝',
                            title: 'Daily Entries',
                            desc: 'Log what you worked on, what blocked you, and what clicked. Small entries compound into big clarity.',
                        },
                        {
                            icon: '🌡️',
                            title: 'Mood Tracking',
                            desc: 'Tag each entry with how you felt. Spot patterns between your mood and your output over time.',
                        },
                        {
                            icon: '🟩',
                            title: 'Activity Heatmap',
                            desc: 'A GitHub-style view of your consistency. Every green square is proof you showed up.',
                        },
                        {
                            icon: '✨',
                            title: 'AI Weekly Summary',
                            desc: 'Every week, get a concise recap of your wins, progress, and a personalized motivational quote. Because every sprint deserves a retrospective and a pep talk.',
                        },
                    ].map(({ icon, title, desc }) => (
                        <div
                            key={title}
                            style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e9e9e7',
                                borderRadius: 12,
                                padding: '28px 24px',
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>{icon}</div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a1a', marginBottom: 8 }}>{title}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b6b6b', lineHeight: 1.7 }}>{desc}</div>
                        </div>
                    ))}

                </div>
            </section>

            {/* Bottom CTA */}
            <section style={{ borderTop: '1px solid #e9e9e7', backgroundColor: '#ffffff', padding: '72px 24px', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px', marginBottom: 16 }}>
                    Start logging. Start growing.
                </h2>
                <p style={{ fontSize: '1rem', color: '#6b6b6b', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                    Every senior dev was once stuck on the same bug you are. The difference is they kept going and kept notes.
                </p>
                <SignInButton large />
            </section>

            {/* Footer */}
            <footer style={{ padding: '24px 40px', borderTop: '1px solid #e9e9e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>DevLog</span>
                <span style={{ fontSize: '0.8rem', color: '#9b9b9b' }}>Built with Next.js · Powered by you</span>
            </footer>

        </div>
    )
}