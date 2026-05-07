import { useNavigate } from 'react-router-dom'
import Dropzone from '../components/Dropzone'

const HOW_IT_WORKS = [
  { icon: '📤', step: '01', title: 'Upload your PDF',       desc: 'Drop any PDF — contracts, invoices, reports, research papers.' },
  { icon: '🤖', step: '02', title: 'AI reads everything',   desc: 'Claude instantly reads and understands the full document.' },
  { icon: '💬', step: '03', title: 'Chat & extract',        desc: 'Ask questions, get summaries, extract structured data.' },
  { icon: '📥', step: '04', title: 'Export your results',   desc: 'Download extracted data as CSV or save your chat history.' },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'rgba(13,18,16,0.85)', backdropFilter: 'blur(12px)', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), #1a7a50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌿</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px' }}>DocIntel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)', background: 'rgba(45,158,107,0.08)', border: '1px solid rgba(45,158,107,0.2)', padding: '6px 14px', borderRadius: 99 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
          Powered by Claude AI
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '90px 48px 70px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '0%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(45,158,107,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(232,168,62,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(45,158,107,0.08)', border: '1px solid rgba(45,158,107,0.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 32, fontSize: 13, color: 'var(--accent)' }}>
          🌿 AI-powered document intelligence
        </div>

        <h1 style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px' }}>
          <span style={{ background: 'linear-gradient(135deg, #eef2f0 30%, #2d9e6b 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Your documents,
          </span>
          <br />
          <span style={{ background: 'linear-gradient(135deg, #e8a83e 20%, #eef2f0 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            finally understood
          </span>
        </h1>

        <p style={{ fontSize: 19, color: 'var(--muted)', maxWidth: 580, margin: '0 auto 56px', lineHeight: 1.6 }}>
          Upload any PDF and instantly chat with it, auto-summarize it, extract structured data, and export results — all powered by Claude AI.
        </p>

        {/* Dropzone */}
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <Dropzone />
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 48px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: 34, fontWeight: 700, textAlign: 'center', marginBottom: 56, letterSpacing: '-0.5px' }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {HOW_IT_WORKS.map((s, i) => (
            <div key={s.step} className="card fade-up" style={{ textAlign: 'center', animationDelay: `${i * 0.1}s`,
              transition: 'border-color 0.2s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(45,158,107,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 8, letterSpacing: '0.1em' }}>{s.step}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { icon: '💬', title: 'Natural language chat',   desc: 'Ask questions in plain English. Get precise answers sourced directly from your document.', color: 'var(--accent)' },
            { icon: '✨', title: 'Smart auto-summary',      desc: 'Get document type, key points, sentiment analysis, and reading time in one click.', color: 'var(--amber)' },
            { icon: '⚡', title: 'Structured extraction',   desc: 'Pull out specific fields — dates, amounts, parties — with AI confidence scores.', color: 'var(--accent)' },
            { icon: '📥', title: 'Export anywhere',         desc: 'Download extracted data as CSV or export your full chat history as a text file.', color: 'var(--amber)' },
          ].map(f => (
            <div key={f.title} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start',
              transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(45,158,107,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: 28, width: 48, height: 48, borderRadius: 10, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 48px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
        🌿 DocIntel — Built with React, Node.js & Claude AI
      </footer>
    </div>
  )
}