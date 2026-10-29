import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePortfolioData } from '../hooks/usePortfolioData'
import Editor from '../components/Editor'
import FullPreview from '../components/FullPreview'

export default function BuilderPage() {
  const { data, patch, patchProfile } = usePortfolioData()
  const [preview, setPreview] = useState(false)
  const navigate = useNavigate()

  if (preview) {
    return <FullPreview data={data} onBack={() => setPreview(false)} />
  }

  return (
    <Editor
      data={data}
      patch={patch}
      patchProfile={patchProfile}
      onChangeTemplate={() => navigate('/templates')}
      onPreview={() => setPreview(true)}
    />
  )
}
