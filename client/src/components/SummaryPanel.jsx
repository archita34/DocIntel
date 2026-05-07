import { useState } from 'react'

const SENTIMENT_CONFIG = {
  positive: { color: 'var(--accent)', icon: '😊', label: 'Positive' },
  neutral:  { color: 'var(--amber)',  icon: '😐', label: 'Neutral'  },
  negative: { color: 'var(--red)',    icon: '😟', label: 'Negative' },
}

const TYPE_ICONS = {
  contract: '📝', invoice: '🧾', report: '📊',
  research: '🔬', legal: '⚖️', other: '📄'
}

export default function SummaryPanel({ docId, summary, onSummary }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generateSummary() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/documents/${docId}/summarize`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSummary(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!summary) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>✨</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>AI Auto-Summary</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
        Get an instant overview of your document — type, key points, sentiment, and more.
      </p>
      {error && <p style={{ color: 'var(--red)', marginBottom: 16, fontSize: 14 }}>❌ {error}</p>}
      <button onClick={generateSummary} className="btn btn-primary" disabled={loading}>
        {loading ? (
          <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Analyzing...</>
        ) : '✨ Generate Summary'}
      </button>
    </div>
  )

  const sentiment = SENTIMENT_CONFIG[summary.sentiment] || SENTIMENT_CONFIG.neutral

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
      {/* Title & type */}
      <div className="card fade-up" style={{ background: 'linear-gradient(135deg, rgba(45,158,107,0.08), rgba(232,168,62,0.05))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>{TYPE_ICONS[summary.type] || '📄'}</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Document type</div>
            <span className="badge badge-green" style={{ textTransform: 'capitalize' }}>{summary.type}</span>
          </div>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, lineHeight: 1.4 }}>{summary.title}</h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{summary.overview}</p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Sentiment',     value: `${sentiment.icon} ${sentiment.label}`, color: sentiment.color },
          { label: 'Reading time',  value: `⏱ ${summary.readingTime}`,             color: 'var(--amber)'  },
          { label: 'Language',      value: `🌐 ${summary.language}`,               color: 'var(--text)'   },
          { label: 'Key points',    value: `📌 ${summary.keyPoints?.length || 0}`, color: 'var(--accent)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Key points */}
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>📌</span> Key Points
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {summary.keyPoints?.map((point, i) => (
            <div key={i} className="fade-up" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: 'rgba(45,158,107,0.15)',
                color: 'var(--accent)', fontSize: 11, fontWeight: 700, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{i + 1}</div>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, flex: 1 }}>{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Regenerate */}
      <button onClick={generateSummary} className="btn btn-secondary" disabled={loading} style={{ justifyContent: 'center' }}>
        {loading ? 'Regenerating...' : '🔄 Regenerate summary'}
      </button>
    </div>
  )
}