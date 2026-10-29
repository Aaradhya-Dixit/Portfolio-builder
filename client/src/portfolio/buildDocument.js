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

function ghost(text) {
  return `<span class="ghost-text">${escapeHtml(text)}</span>`
}

function show(value, fallback, placeholders) {
  const trimmed = String(value ?? '').trim()
  if (trimmed) return escapeHtml(trimmed)
  return placeholders ? ghost(fallback) : ''
}

function photoMarkup(profile, photoSrc) {
  if (photoSrc) {
    return `<img class="avatar" src="${escapeAttr(photoSrc)}" alt="${escapeAttr(profile.name || 'Profile')} portrait" />`
  }
  return `<div class="avatar placeholder" aria-hidden="true">${initials(profile.name)}</div>`
}

function linkButtons(profile, placeholders) {
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
  if (!items.length && placeholders) {
    items.push(`<span class="btn primary ghost-text">Email</span>`)
    items.push(`<span class="btn ghost-text">GitHub</span>`)
  }
  return items.join('')
}

function sectionAbout(profile, placeholders) {
  const body = show(profile.bio, 'A short intro about you', placeholders)
  if (!body) return ''
  return `<section id="about">
  <h2>About</h2>
  <p class="bio">${body}</p>
</section>`
}

function sectionSkills(skills, placeholders) {
  const list = skills.filter(Boolean)
  const tags = list.length
    ? list.map((s) => `<li>${escapeHtml(s)}</li>`).join('')
    : placeholders
      ? ['Skill 1', 'Skill 2', 'Skill 3'].map((s) => `<li class="ghost-text">${s}</li>`).join('')
      : ''
  if (!tags) return ''
  return `<section id="skills">
  <h2>Skills</h2>
  <ul class="skills">${tags}</ul>
</section>`
}

function sectionProjects(projects, placeholders) {
  const real = (projects || []).filter((p) => p.title || p.description || p.repo || p.demo)
  const source =
    real.length > 0
      ? real
      : placeholders
        ? [{ title: '', description: '', repo: '', demo: '' }]
        : []

  if (!source.length) return ''

  const cards = source
    .map((p) => {
      const links = [
        p.demo ? `<a class="btn primary" href="${escapeAttr(p.demo)}" target="_blank" rel="noreferrer">Live demo</a>` : '',
        p.repo ? `<a class="btn" href="${escapeAttr(p.repo)}" target="_blank" rel="noreferrer">Code</a>` : '',
      ].join('')
      return `<article class="project">
  <h3>${show(p.title, 'Project title', placeholders) || escapeHtml(p.title)}</h3>
  <p>${show(p.description, 'A short description of this project.', placeholders)}</p>
  <div class="project-links">${links}</div>
</article>`
    })
    .join('')

  return `<section id="projects">
  <h2>Projects</h2>
  <div class="projects">${cards}</div>
</section>`
}

function sectionContact(profile, placeholders) {
  const rows = []
  if (profile.email) rows.push(`<div>Email · <a href="mailto:${escapeAttr(profile.email)}">${escapeHtml(profile.email)}</a></div>`)
  if (profile.github) rows.push(`<div>GitHub · <a href="${escapeAttr(profile.github)}" target="_blank" rel="noreferrer">${escapeHtml(profile.github)}</a></div>`)
  if (profile.linkedin) rows.push(`<div>LinkedIn · <a href="${escapeAttr(profile.linkedin)}" target="_blank" rel="noreferrer">${escapeHtml(profile.linkedin)}</a></div>`)
  if (profile.location) rows.push(`<div>Based in ${escapeHtml(profile.location)}</div>`)
  if (!rows.length && placeholders) {
    rows.push(`<p class="muted ghost-text">Your email and links will appear here</p>`)
  }
  if (!rows.length) return ''
  return `<section id="contact">
  <h2>Contact</h2>
  <div class="contact-list">${rows.join('')}</div>
</section>`
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

export function buildBodyHtml(data, photoSrc, placeholders = false) {
  const { profile, sectionOrder, templateId } = data
  const builders = {
    about: () => sectionAbout(profile, placeholders),
    skills: () => sectionSkills(data.skills, placeholders),
    projects: () => sectionProjects(data.projects, placeholders),
    contact: () => sectionContact(profile, placeholders),
  }
  const sections = (sectionOrder?.length ? sectionOrder : Object.keys(SECTION_META))
    .map((id) => builders[id]?.() ?? '')
    .join('\n')

  const footerName = profile.name?.trim()
    ? escapeHtml(profile.name.trim())
    : placeholders
      ? ghost('Your name')
      : 'Portfolio'

  return `<div class="wrap">
  <header class="hero">
    <div class="hero-inner">
      ${photoMarkup(profile, photoSrc)}
      <div>
        <p class="eyebrow">${escapeHtml(templateId === 'tech' ? 'portfolio.exe' : 'portfolio')}</p>
        <h1>${show(profile.name, 'Your name here', placeholders) || 'Portfolio'}</h1>
        <p class="headline">${show(profile.headline, 'Your headline here', placeholders)}</p>
        <div class="links">${linkButtons(profile, placeholders)}</div>
      </div>
    </div>
  </header>
  <main>
    ${sections}
  </main>
  <footer class="site-foot">© ${new Date().getFullYear()} ${footerName}</footer>
</div>`
}

export function buildStyleCss(data) {
  return buildPortfolioCss({
    accent: data.accent || '#0f766e',
    fontFamily: getFontCss(data.font),
  })
}

/** Full HTML document for iframe preview (CSS inlined) or export (linked stylesheet). */
export function buildHtmlDocument(data, { linkedCss = false, photoSrc = '', placeholders = false } = {}) {
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
${buildBodyHtml(data, photoSrc, placeholders)}
</body>
</html>`
}
