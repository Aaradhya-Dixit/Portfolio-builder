import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePortfolioData } from '../hooks/usePortfolioData'
import TemplateSelect from '../components/TemplateSelect'

export default function TemplatesPage() {
  const { user } = useAuth()
  const { patch } = usePortfolioData(user?.id)
  const navigate = useNavigate()

  function pickTemplate(template) {
    patch({
      templateId: template.id,
      accent: template.accent,
      font: template.font,
    })
    navigate('/builder')
  }

  return <TemplateSelect onPick={pickTemplate} />
}
