import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dropzone() {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()
  const navigate = useNavigate()

  async function uploadFile(file) {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a PDF file only.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB.')
      return
    }

    setUploading(true)
    setError('')

    const form = new FormData()
    form.append('pdf', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      navigate(`/doc/${data.id}`, { state: data })
    } catch (err) {
      setError(err.message)
      setUploading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    uploadFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'rgba(45,158,107,0.25)'}`,
          borderRadius: 20,
          padding: '60px 40px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s',
          background: dragging ? 'rgba(45,158,107,0.05)' : 'transparent',
          animation: dragging ? 'glow 1.5s infinite' : 'none',
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }}
          onChange={e => uploadFile(e.target.files[0])} />

        {uploading ? (
          <div>
            <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
            <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent)' }}>Processing your document...</p>
            <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 14 }}>Extracting text and preparing AI analysis</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 64, marginBottom: 20, filter: 'drop-shadow(0 0 20px rgba(45,158,107,0.3))' }}>📄</div>
            <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
              {dragging ? 'Drop it here!' : 'Drop your PDF here'}
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 24 }}>
              or click to browse · Max 10MB
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Contracts', 'Invoices', 'Reports', 'Research papers', 'Legal docs'].map(tag => (
                <span key={tag} className="badge badge-muted">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(224,82,82,0.1)', border: '1px solid rgba(224,82,82,0.2)', borderRadius: 8, color: 'var(--red)', fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  )
}