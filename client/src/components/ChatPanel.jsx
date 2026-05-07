import { useState, useRef, useEffect } from 'react'

const SUGGESTED = [
  'Summarize the main points of this document',
  'What are the key dates and deadlines mentioned?',
  'Who are the parties involved?',
  'What are the financial terms?',
  'Are there any risks or obligations I should know about?',
]

function renderMd(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm,  '<h2>$1</h2>')
    .replace(/^# (.*$)/gm,   '<h1>$1</h1>')
    .replace(/^\- (.*$)/gm,  '<li>$1</li>')
    .replace(/\n/g, '<br/>')
}

export default function ChatPanel({ docId, messages, onNewMessage }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setLoading(true)

    onNewMessage({ role: 'user', content: msg, ts: Date.now() })

    try {
      const res = await fetch(`/api/documents/${docId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onNewMessage({ role: 'assistant', content: data.reply, ts: Date.now() })
    } catch (err) {
      onNewMessage({ role: 'assistant', content: `❌ Error: ${err.message}`, ts: Date.now() })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Ask me anything about your document</p>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>I've read the full text and I'm ready to help</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420, margin: '0 auto' }}>
              {SUGGESTED.map(q => (
                <button key={q} onClick={() => send(q)} style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '10px 16px', color: 'var(--muted)', fontSize: 13, cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.15s', fontFamily: 'var(--font)'
                }}
                  onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--text)' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="fade-up" style={{
            display: 'flex', gap: 12,
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'user' ? 'var(--amber)' : 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
            }}>
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div style={{
              maxWidth: '75%',
              background: msg.role === 'user' ? 'rgba(232,168,62,0.1)' : 'var(--surface2)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(232,168,62,0.2)' : 'var(--border)'}`,
              borderRadius: 12, padding: '12px 16px',
            }}>
              {msg.role === 'assistant' ? (
                <div className="md" style={{ fontSize: 14, lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: renderMd(msg.content) }} />
              ) : (
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{msg.content}</p>
              )}
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                {new Date(msg.ts).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="input"
            placeholder="Ask anything about this document..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={loading}
          />
          <button onClick={() => send()} className="btn btn-primary" disabled={!input.trim() || loading}>
            {loading ? '...' : '↑'}
          </button>
        </div>
      </div>
    </div>
  )
}