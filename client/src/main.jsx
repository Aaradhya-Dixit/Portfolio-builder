import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { removeLegacyDrafts } from './data/storage'
import './index.css'
import App from './App.jsx'

// Remove legacy un-keyed drafts on initial load
removeLegacyDrafts()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
