'use client'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'


const MOOD_OPTIONS = ['🔥 Productive', '😐 Neutral', '😓 Struggling', '🎉 Excited']
const TAG_SUGGESTIONS = ['React', 'TypeScript', 'Bug Fix', 'Algorithm', 'System Design', 'DevOps']
    
export default function NewEntryPage() {
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [mood, setMood] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const addTag = (tag: string) => {
        const t = tag.trim()
        if (t && !tags.includes(t)) setTags([...tags, t])
        setTagInput('')
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag(tagInput)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
            setError('Title and content are required')
            return
        }
        setError('')
        setLoading(true)
        
        try {
            const res = await fetch('/api/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, mood, tags }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to save entry.')
            }

            // Success — go to the entries list
            router.push('/entries')
            } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong.')
            } finally {
            // Always turn off the loading spinner whether it succeeded or failed
            setLoading(false)
            }
        }

        return (
            <div style={{ maxWidth: 720 }}>
            <h2 className="fw-bold mb-1">New Entry</h2>
            <p className="text-secondary mb-4">What did you work on today?</p>

            {/* Only renders if there is an error message */}
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>

                {/* Title */}
                <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Fixed auth bug in DevLog"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                </div>

                {/* Content */}
                <div className="mb-3">
                <label className="form-label fw-semibold">Journal Entry</label>
                <textarea
                    className="form-control"
                    rows={8}
                    placeholder="What did you build, learn, or struggle with today?"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                </div>

                {/* Mood — clicking a button toggles it on/off */}
                <div className="mb-3">
                <label className="form-label fw-semibold">Mood</label>
                <div className="d-flex flex-wrap gap-2">
                    {MOOD_OPTIONS.map(m => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => setMood(mood === m ? '' : m)}
                        className={`btn btn-sm ${
                        mood === m ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                    >
                        {m}
                    </button>
                    ))}
                </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                <label className="form-label fw-semibold">Tags</label>

                {/* Show active tags as removable badges */}
                {tags.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                        <span
                        key={tag}
                        className="badge bg-primary d-flex align-items-center gap-1"
                        >
                        {tag}
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            style={{ fontSize: '0.6rem' }}
                            onClick={() => removeTag(tag)}
                        />
                        </span>
                    ))}
                    </div>
                )}

                {/* Custom tag input */}
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                />

                {/* Quick-add suggestions — only show tags not already added */}
                <div className="d-flex flex-wrap gap-2">
                    {TAG_SUGGESTIONS.filter(s => !tags.includes(s)).map(s => (
                    <button
                        key={s}
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => addTag(s)}
                    >
                        + {s}
                    </button>
                    ))}
                </div>
                </div>

                {/* Submit */}
                <div className="d-flex gap-2">
                <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                >
                    {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving…
                    </>
                    ) : (
                    'Save Entry'
                    )}
                </button>
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => router.back()}
                >
                    Cancel
                </button>
                </div>

            </form>
            </div>
        )
    }