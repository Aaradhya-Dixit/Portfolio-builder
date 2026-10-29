import { useNavigate } from 'react-router-dom'
import { usePortfolioData } from '../hooks/usePortfolioData'
import TemplateSelect from '../components/TemplateSelect'

export default function TemplatesPage() {
  const { patch } = usePortfolioData()
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
