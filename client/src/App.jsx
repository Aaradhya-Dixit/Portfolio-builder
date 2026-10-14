import { useState } from 'react'
import { usePortfolioData } from './hooks/usePortfolioData'
import TemplateSelect from './components/TemplateSelect'
import Editor from './components/Editor'
import FullPreview from './components/FullPreview'

// Simple view switcher: templates → editor → full-screen preview.
// All portfolio fields live in React state and localStorage (no backend).
export default function App() {
  const { data, patch, patchProfile } = usePortfolioData()
  const [view, setView] = useState(() => (data.templateId ? 'editor' : 'templates'))

  function pickTemplate(template) {
    patch({
      templateId: template.id,
      accent: template.accent,
      font: template.font,
    })
    setView('editor')
  }

  if (view === 'templates') {
    return <TemplateSelect onPick={pickTemplate} />
  }

  if (view === 'preview') {
    return <FullPreview data={data} onBack={() => setView('editor')} />
  }

  return (
    <Editor
      data={data}
      patch={patch}
      patchProfile={patchProfile}
      onChangeTemplate={() => setView('templates')}
      onPreview={() => setView('preview')}
    />
  )
}
