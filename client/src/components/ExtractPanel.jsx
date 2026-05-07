import { useState } from 'react'

const PRESET_FIELDS = {
  'Contract':  ['parties', 'effectiveDate', 'expiryDate', 'value', 'paymentTerms', 'jurisdiction', 'terminationClause'],
  'Invoice':   ['invoiceNumber', 'date', 'dueDate', 'vendor', 'client', 'totalAmount', 'taxAmount', 'lineItems'],
  'Report':    ['title', 'author', 'date', 'executiveSummary', 'recommendations', 'conclusions'],
  'Custom':    [],
}

export default function ExtractPanel({ docId, extracted, onExtracted }) {
  const [preset, setPreset]         = useState('Contract')
  const [customFields, setCustom]   = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  async function extract() {
    setLoading(true)
    setError('')
    const fields = preset === 'Custom'
      ? customFields.split(',').map(f => f.trim()).filter(Boolean)
      : PRESET_FIELDS[preset]

    try {
      const res = await fetch(`/api/documents/${docId}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onExtracted(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function downloadCSV() {
    window.open(`/api/documents/${docId}/export/csv`, '_blank')
  }

  function getConfidenceColor(conf) {
    if (conf >= 80) return 'var(--accent)'
    if (conf >= 50) return 'var(--amber)'
    return 'var(--red)'
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
      {/* Config */}
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>🔍 Extract structured data</h3>

        {/* Preset selector */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {Object.keys(PRESET_FIELDS).map(p => (
            <button key={p} onClick={() => setPreset(p)} className={`btn btn-sm ${preset === p ? 'btn-primary' : 'btn-secondary'}`}>
              {p}
            </button>
          ))}
        </div>

        {/* Fields preview */}
        {preset !== 'Custom' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {PRESET_FIELDS[preset].map(f => (
              <span key={f} className="badge badge-muted" style={{ fontFamily: 'var(--mono)', textTransform: 'none' }}>{f}</span>
            ))}
          </div>
        )}

        {preset === 'Custom' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
              Enter field names separated by commas
            </label>
            <input className="input" placeholder="e.g. author, date, totalAmount, signatures"
              value={customFields} onChange={e => setCustom(e.target.value)} />
          </div>
        )}

        {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>❌ {error}</p>}

        <button onClick={extract} className="btn btn-amber" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? (
            <><div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0d1210', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Extracting...</>
          ) : '⚡ Extract data'}
        </button>
      </div>

      {/* Results */}
      {extracted && (
        <div className="card fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Extracted fields</h3>
            <button onClick={downloadCSV} className="btn btn-secondary btn-sm">⬇ Export CSV</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
            {Object.entries(extracted).map(([key, val], i) => {
              const value = typeof val === 'object' ? val?.value : val
              const confidence = typeof val === 'object' ? val?.confidence : null
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16, padding: '12px 16px',
                  background: i % 2 === 0 ? 'var(--surface2)' : 'var(--surface3)',
                }}>
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--amber)', fontWeight: 500 }}>{key}</span>
                  </div>
                  <div style={{ flex: 1, fontSize: 14, color: value ? 'var(--text)' : 'var(--muted)', wordBreak: 'break-word' }}>
                    {value || '—'}
                  </div>
                  {confidence !== null && (
                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
                        <div style={{ width: `${confidence}%`, height: '100%', background: getConfidenceColor(confidence), borderRadius: 2, transition: 'width 0.5s ease' }} />
                      </div>
                      <span style={{ fontSize: 11, color: getConfidenceColor(confidence), fontFamily: 'var(--mono)', minWidth: 30 }}>{confidence}%</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}