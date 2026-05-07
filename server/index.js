import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Groq from 'groq-sdk'
import pdfParse from 'pdf-parse/lib/pdf-parse.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

// File upload config
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Only PDF files allowed'))
  }
})

// In-memory document store
const documents = new Map()

// ── Upload PDF ──
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ error: 'No file uploaded' })

    const buffer = fs.readFileSync(file.path)
    const parsed = await pdfParse(buffer)

    const doc = {
      id:         file.filename,
      name:       file.originalname,
      text:       parsed.text,
      pages:      parsed.numpages,
      words:      parsed.text.split(/\s+/).length,
      uploadedAt: Date.now(),
      messages:   [],
      summary:    null,
      extracted:  null,
    }

    documents.set(doc.id, doc)
    fs.unlinkSync(file.path)

    res.json({
      id:    doc.id,
      name:  doc.name,
      pages: doc.pages,
      words: doc.words,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Get document ──
app.get('/api/documents/:id', (req, res) => {
  const doc = documents.get(req.params.id)
  if (!doc) return res.status(404).json({ error: 'Document not found' })
  res.json({
    id:        doc.id,
    name:      doc.name,
    pages:     doc.pages,
    words:     doc.words,
    messages:  doc.messages,
    summary:   doc.summary,
    extracted: doc.extracted,
  })
})

// ── Chat with document ──
app.post('/api/documents/:id/chat', async (req, res) => {
  const doc = documents.get(req.params.id)
  if (!doc) return res.status(404).json({ error: 'Document not found' })

  const { message } = req.body
  if (!message) return res.status(400).json({ error: 'Message required' })

  doc.messages.push({ role: 'user', content: message, ts: Date.now() })

  const history = doc.messages.map(m => ({
    role: m.role,
    content: m.content
  }))

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: `You are an expert document analyst. The user has uploaded a PDF document.
Here is the full text of the document:
---
${doc.text.slice(0, 40000)}
---
Answer questions about this document accurately and concisely.
If something is not in the document, say so clearly.
Format your responses with markdown when helpful.`
        },
        ...history
      ]
    })

    const reply = response.choices[0].message.content
    doc.messages.push({ role: 'assistant', content: reply, ts: Date.now() })

    res.json({ reply, messageCount: doc.messages.length })
  } catch (err) {
    res.status(500).json({ error: 'AI request failed: ' + err.message })
  }
})

// ── Auto-summarize ──
app.post('/api/documents/:id/summarize', async (req, res) => {
  const doc = documents.get(req.params.id)
  if (!doc) return res.status(404).json({ error: 'Document not found' })

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: 'You are a document analyst. Always respond with valid JSON only. No extra text, no markdown backticks.'
        },
        {
          role: 'user',
          content: `Provide a comprehensive summary of this document as JSON with these exact fields:
{
  "title": "document title or inferred topic",
  "type": "contract/invoice/report/research/legal/other",
  "overview": "2-3 sentence overview",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "sentiment": "positive/neutral/negative",
  "readingTime": "estimated reading time in minutes",
  "language": "detected language"
}

Document text:
${doc.text.slice(0, 40000)}`
        }
      ]
    })

    const raw = response.choices[0].message.content.replace(/```json|```/g, '').trim()
    doc.summary = JSON.parse(raw)
    res.json(doc.summary)
  } catch (err) {
    res.status(500).json({ error: 'Summarization failed: ' + err.message })
  }
})

// ── Extract structured data ──
app.post('/api/documents/:id/extract', async (req, res) => {
  const doc = documents.get(req.params.id)
  if (!doc) return res.status(404).json({ error: 'Document not found' })

  const { fields } = req.body

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: 'You are a data extraction specialist. Always respond with valid JSON only. No extra text, no markdown backticks.'
        },
        {
          role: 'user',
          content: `Extract the following information from this document: ${fields?.join(', ') || 'all key data fields'}.

Return a JSON object where each key is a field name and the value is an object with "value" and "confidence" (0-100).
Format:
{
  "fieldName": { "value": "extracted value", "confidence": 95 }
}

Document text:
${doc.text.slice(0, 40000)}`
        }
      ]
    })

    const raw = response.choices[0].message.content.replace(/```json|```/g, '').trim()
    doc.extracted = JSON.parse(raw)
    res.json(doc.extracted)
  } catch (err) {
    res.status(500).json({ error: 'Extraction failed: ' + err.message })
  }
})

// ── Export to CSV ──
app.get('/api/documents/:id/export/csv', (req, res) => {
  const doc = documents.get(req.params.id)
  if (!doc || !doc.extracted) return res.status(404).json({ error: 'No extracted data' })

  const rows = [['Field', 'Value', 'Confidence']]
  Object.entries(doc.extracted).forEach(([key, val]) => {
    if (typeof val === 'object' && val?.value !== undefined) {
      rows.push([key, String(val.value ?? ''), String(val.confidence ?? '')])
    }
  })

  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="${doc.name.replace('.pdf', '')}-extracted.csv"`)
  res.send(csv)
})

// ── Export chat to TXT ──
app.get('/api/documents/:id/export/chat', (req, res) => {
  const doc = documents.get(req.params.id)
  if (!doc) return res.status(404).json({ error: 'Not found' })

  const txt = doc.messages
    .map(m => `[${m.role.toUpperCase()}]\n${m.content}\n`)
    .join('\n---\n\n')

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Content-Disposition', `attachment; filename="${doc.name.replace('.pdf', '')}-chat.txt"`)
  res.send(txt)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🌿 DocIntel server running on port ${PORT}`))