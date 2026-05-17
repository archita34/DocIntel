# 🌿 DocIntel — AI Document Intelligence Platform

> Upload any PDF and instantly chat with it, get AI summaries, extract structured data, and export results — powered by Groq LLaMA.

---

## 🔴 Live Demo

**[https://docintel-link.netlify.app](https://magnificent-cascaron-012187.netlify.app/)**

---

## 🚀 What is DocIntel?

DocIntel turns any PDF into an intelligent, queryable document. Drop in a contract, invoice, research paper, or report — and immediately start asking questions, extracting key fields, and getting AI-powered summaries. No more manually reading through 50-page documents.

---

## ✨ Features

| Feature | Details |
|---|---|
| 📤 PDF Upload | Drag and drop any PDF up to 10MB |
| 💬 Chat with document | Ask questions in natural language, get precise answers |
| ✨ Auto-summary | Document type, key points, sentiment, reading time |
| ⚡ Data extraction | Pull specific fields with AI confidence scores |
| 📥 Export CSV | Download extracted data as a spreadsheet |
| 📝 Export chat | Save full conversation as a text file |
| 🎯 Preset templates | Contract, Invoice, Report extraction presets |
| 🌿 Green + amber theme | Unique dark forest theme |

---
---

## 🧰 Tech Stack

**Frontend**
- React 18
- React Router v6
- Vite
- Custom CSS (forest green + amber theme)

**Backend**
- Node.js + Express
- Multer (file upload)
- pdf-parse (text extraction)
- Groq SDK (LLaMA 3.3 70B)

---

## ⚙️ How to Run Locally

**Clone the repo**
```bash
git clone https://github.com/archita34/doc-intelligence.git
cd doc-intelligence
```

**Set up environment**
```bash
cd server
cp .env.example .env
# Add your GROQ_API_KEY
```

Get a free Groq API key at **console.groq.com**

**Run backend**
```bash
cd server
npm install
npm run dev
```

**Run frontend** (new terminal)
```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

---

## 🔑 Environment Variables

```env
GROQ_API_KEY=gsk_your_key_here
PORT=3001
CLIENT_URL=http://localhost:5173
```

---

## 📄 Supported Document Types

| Type | Works best for |
|---|---|
| 📝 Contracts | Parties, dates, payment terms, jurisdiction |
| 🧾 Invoices | Invoice number, amounts, vendor, due date |
| 📊 Reports | Executive summary, recommendations, conclusions |
| 🔬 Research | Abstract, methodology, findings |
| ⚖️ Legal | Clauses, obligations, risks |
| 📄 Any PDF | General Q&A and summarization |

---

## 💬 Example Questions to Ask

- *"What are the payment terms in this contract?"*
- *"Who are the parties involved and what are their obligations?"*
- *"What is the total invoice amount including tax?"*
- *"Summarize the key findings of this report"*
- *"Are there any penalty clauses I should know about?"*

---

---

## 🚀 Deployment

| Service | Platform |
|---|---|
| Frontend | Netlify |
| Backend | Railway |

---

---

## Built By

**Archita** · [GitHub @archita34](https://github.com/archita34)
