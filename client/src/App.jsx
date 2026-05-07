import { Routes, Route } from 'react-router-dom'
import Home     from './pages/Home'
import Document from './pages/Document'

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<Home />} />
      <Route path="/doc/:id" element={<Document />} />
    </Routes>
  )
}