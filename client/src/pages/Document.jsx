import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import ChatPanel    from '../components/ChatPanel'
import SummaryPanel from '../components/SummaryPanel'
import ExtractPanel from '../components/ExtractPanel'

const TABS = [
  { id: 'chat',    label: '💬 Chat',    desc: 'Ask questions' },
  { id: 'summary', label: '✨ Summary', desc: 'Auto-summarize' },
  { id: 'extract', label: '⚡ Extract', desc: 'Pull data'      },
]

export default function Document() {
  const { id }       = useParams()
  const location     = useLocation()
  const navigate     = useNavigate()
  const [tab, setTab]           = useState('chat')
  const [doc, setDoc]           = useState(location.state || null)
  const [messages, setMessages] = useState([])
  const [summary, setSummary]   = useState(null)
  const [extracted, setExtracted] = useState(null)

  useEffect(() => {
    if (!doc) {
      fetch(`/api/documents/${id}`)
        .then(r => r.json())
        .then(d => {
          setDoc(d)
          setMessages(d.messages || [])
          setSummary(d.summary || null)
          setExtracted(d.extracted || null)
        })
        .catch(() => navigate('/'))
    }
  }, [id])

  function addMessage(msg) {
    setMessages(prev => [...prev, msg])
  }

  if (!doc) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px',
        height: 58, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        flexShrink: 0
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20, lineHeight: 1, padding: 4, borderRadius: 6 }}>←</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, overflow: 'hidden' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), #1a7a50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>📄</div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</p>
            <p style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
              {doc.pages} pages · {doc.words?.toLocaleString()} words
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500,
              padding: '6px 14px', borderRadius: 7, cursor: 'pointer',
              background: tab === t.id ? 'rgba(45,158,107,0.12)' : 'transparent',
              border: tab === t.id ? '1px solid rgba(45,158,107,0.25)' : '1px solid transparent',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              transition: 'all 0.15s'
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Export chat */}
        <a href={`/api/documents/${id}/export/chat`} target="_blank" className="btn btn-secondary btn-sm">
          ⬇ Chat
        </a>
      </header>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'chat' && (
          <ChatPanel
            docId={id}
            messages={messages}
            onNewMessage={addMessage}
          />
        )}
        {tab === 'summary' && (
          <SummaryPanel
            docId={id}
            summary={summary}
            onSummary={s => setSummary(s)}
          />
        )}
        {tab === 'extract' && (
          <ExtractPanel
            docId={id}
            extracted={extracted}
            onExtracted={e => setExtracted(e)}
          />
        )}
      </div>
    </div>
  )
}