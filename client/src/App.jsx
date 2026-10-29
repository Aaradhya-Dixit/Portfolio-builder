import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import TemplatesPage from './pages/TemplatesPage'
import BuilderPage from './pages/BuilderPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/builder" element={<BuilderPage />} />
    </Routes>
  )
}
