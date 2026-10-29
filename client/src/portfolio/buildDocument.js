import { FONTS, SECTION_META } from '../data/defaults'
import { escapeHtml, escapeAttr } from './escape'
import { buildPortfolioCss } from './templateCss'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,700&family=Space+Grotesk:wght@400;500;700&display=swap'

function initials(name) {
  return escapeHtml(
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '•',
  )
}

function photoMarkup(profile, photoSrc) {
  if (photoSrc) {
    return `<img class="avatar" src="${escapeAttr(photoSrc)}" alt="${escapeAttr(profile.name)} portrait" />`
  }
  return `<div class="avatar placeholder" aria-hidden="true">${initials(profile.name)}</div>`
}

function linkButtons(profile) {
  const items = []
  if (profile.email) {
    items.push(`<a class="btn primary" href="mailto:${escapeAttr(profile.email)}">Email</a>`)
  }
  if (profile.github) {
    items.push(`<a class="btn" href="${escapeAttr(profile.github)}" target="_blank" rel="noreferrer">GitHub</a>`)
  }
  if (profile.linkedin) {
    items.push(`<a class="btn" href="${escapeAttr(profile.linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>`)
  }
  return items.join('')
}

function sectionAbout(profile) {
  return `<section id="about">
  <h2>About</h2>
  <p class="bio">${escapeHtml(profile.bio || 'Add a short bio in the editor.')}</p>
</section>`
}

function sectionSkills(skills) {
  const tags = (skills.length ? skills : ['Add a skill']).map((s) => `<li>${escapeHtml(s)}</li>`).join('')
  return `<section id="skills">
  <h2>Skills</h2>
  <ul class="skills">${tags}</ul>
</section>`
}

function sectionProjects(projects) {
  const cards = (projects.length ? projects : [{ title: 'Your project', description: 'Add a project in the editor.', repo: '', demo: '' }])
    .map((p) => {
      const links = [
        p.demo ? `<a class="btn primary" href="${escapeAttr(p.demo)}" target="_blank" rel="noreferrer">Live demo</a>` : '',
        p.repo ? `<a class="btn" href="${escapeAttr(p.repo)}" target="_blank" rel="noreferrer">Code</a>` : '',
      ].join('')
      return `<article class="project">
  <h3>${escapeHtml(p.title || 'Untitled project')}</h3>
  <p>${escapeHtml(p.description || '')}</p>
  <div class="project-links">${links}</div>
</article>`
    })
    .join('')
  return `<section id="projects">
  <h2>Projects</h2>
  <div class="projects">${cards}</div>
</section>`
}

function sectionContact(profile) {
  const rows = []
  if (profile.email) rows.push(`<div>Email · <a href="mailto:${escapeAttr(profile.email)}">${escapeHtml(profile.email)}</a></div>`)
  if (profile.github) rows.push(`<div>GitHub · <a href="${escapeAttr(profile.github)}" target="_blank" rel="noreferrer">${escapeHtml(profile.github)}</a></div>`)
  if (profile.linkedin) rows.push(`<div>LinkedIn · <a href="${escapeAttr(profile.linkedin)}" target="_blank" rel="noreferrer">${escapeHtml(profile.linkedin)}</a></div>`)
  if (profile.location) rows.push(`<div>Based in ${escapeHtml(profile.location)}</div>`)
  return `<section id="contact">
  <h2>Contact</h2>
  <div class="contact-list">${rows.join('') || '<p class="muted">Add contact details in the editor.</p>'}</div>
</section>`
}

const SECTION_BUILDERS = {
  about: (data) => sectionAbout(data.profile),
  skills: (data) => sectionSkills(data.skills),
  projects: (data) => sectionProjects(data.projects),
  contact: (data) => sectionContact(data.profile),
}

export function getFontCss(fontId) {
  return FONTS.find((f) => f.id === fontId)?.css ?? FONTS[0].css
}

export function parsePhotoAsset(photoDataUrl) {
  if (!photoDataUrl?.startsWith('data:')) return null
  const match = photoDataUrl.match(/^data:(image\/[\w+.-]+);base64,(.+)$/)
  if (!match) return null
  const mime = match[1]
  const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg'
  return { mime, ext, base64: match[2], path: `assets/photo.${ext}` }
}

export function buildBodyHtml(data, photoSrc) {
  const { profile, sectionOrder, templateId } = data
  const sections = (sectionOrder?.length ? sectionOrder : Object.keys(SECTION_META))
    .map((id) => SECTION_BUILDERS[id]?.(data) ?? '')
    .join('\n')

  return `<div class="wrap">
  <header class="hero">
    <div class="hero-inner">
      ${photoMarkup(profile, photoSrc)}
      <div>
        <p class="eyebrow">${escapeHtml(templateId === 'tech' ? 'portfolio.exe' : 'portfolio')}</p>
        <h1>${escapeHtml(profile.name || 'Your name')}</h1>
        <p class="headline">${escapeHtml(profile.headline || 'Your headline')}</p>
        <div class="links">${linkButtons(profile)}</div>
      </div>
    </div>
  </header>
  <main>
    ${sections}
  </main>
  <footer class="site-foot">© ${new Date().getFullYear()} ${escapeHtml(profile.name || 'Portfolio')}</footer>
</div>`
}

export function buildStyleCss(data) {
  return buildPortfolioCss({
    accent: data.accent || '#0f766e',
    fontFamily: getFontCss(data.font),
  })
}

/** Full HTML document for iframe preview (CSS inlined) or export (linked stylesheet). */
export function buildHtmlDocument(data, { linkedCss = false, photoSrc = '' } = {}) {
  const title = `${data.profile.name || 'Portfolio'} — Portfolio`
  const css = buildStyleCss(data)
  // Relative paths so the export works from file:// (double-click index.html).
  const headCss = linkedCss
    ? `<link rel="stylesheet" href="./style.css" />`
    : `<style>${css}</style>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${FONT_HREF}" rel="stylesheet" />
  ${headCss}
</head>
<body data-template="${escapeAttr(data.templateId || 'minimalist')}">
${buildBodyHtml(data, photoSrc)}
</body>
</html>`
}
