import { TEMPLATES, createDefaultData } from '../data/defaults'
import { buildHtmlDocument } from '../portfolio/buildDocument'
import './TemplateSelect.css'

function MiniPreview({ template }) {
  const sample = {
    ...createDefaultData(),
    templateId: template.id,
    accent: template.accent,
    font: template.font,
  }
  const srcDoc = buildHtmlDocument(sample, { photoSrc: '' })

  return (
    <div className="mini-frame">
      <iframe title={`${template.name} preview`} srcDoc={srcDoc} tabIndex={-1} />
    </div>
  )
}

export default function TemplateSelect({ onPick }) {
  return (
    <div className="select-page">
      <header className="select-hero">
        <p className="brand">Portfolio Builder</p>
        <h1>Pick a template to start</h1>
        <p className="lede">
          Hover a card to preview. You can change colours, fonts, and section order later.
        </p>
      </header>

      <div className="template-grid">
        {TEMPLATES.map((template) => (
          <article key={template.id} className="template-card">
            <MiniPreview template={template} />
            <div className="template-meta">
              <h2>{template.name}</h2>
              <p>{template.blurb}</p>
              <button type="button" onClick={() => onPick(template)}>
                Use {template.name}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
