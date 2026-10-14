// Default portfolio data shown in the editor / live preview.

export const STORAGE_KEY = 'portfolio-builder-data'

export const TEMPLATES = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    blurb: 'Quiet layout, lots of space, serif headings.',
    accent: '#0f766e',
    font: 'serif',
  },
  {
    id: 'tech',
    name: 'Tech Developer',
    blurb: 'Dark terminal feel with mono details.',
    accent: '#2dd4bf',
    font: 'mono',
  },
  {
    id: 'creative',
    name: 'Creative',
    blurb: 'Bold type, overlapping cards, playful grid.',
    accent: '#0d9488',
    font: 'grotesk',
  },
]

export const FONTS = [
  { id: 'inter', label: 'Inter', css: '"Inter", system-ui, sans-serif' },
  { id: 'grotesk', label: 'Space Grotesk', css: '"Space Grotesk", system-ui, sans-serif' },
  { id: 'serif', label: 'Source Serif', css: '"Source Serif 4", Georgia, serif' },
  { id: 'mono', label: 'JetBrains Mono', css: '"JetBrains Mono", ui-monospace, monospace' },
]

export const ACCENT_PRESETS = [
  '#0f766e',
  '#14b8a6',
  '#0d9488',
  '#115e59',
  '#2563eb',
  '#7c3aed',
  '#e11d48',
  '#d97706',
]

export const SECTION_META = {
  about: { label: 'About' },
  skills: { label: 'Skills' },
  projects: { label: 'Projects' },
  contact: { label: 'Contact' },
}

export const DEFAULT_SECTIONS = ['about', 'skills', 'projects', 'contact']

export function createDefaultData() {
  return {
    templateId: null,
    accent: '#0f766e',
    font: 'inter',
    sectionOrder: [...DEFAULT_SECTIONS],
    profile: {
      name: 'Aaradhya',
      headline: 'Computer Science student · web developer',
      bio: 'I like turning ideas into clean, usable websites. Currently learning full-stack development and building small tools that help other students ship their work.',
      photo: '',
      email: 'hello@example.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      location: 'India',
    },
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Python', 'Git'],
    projects: [
      {
        id: 'p1',
        title: 'Study Timer',
        description: 'A focused pomodoro timer with session stats and a calm, distraction-free UI.',
        repo: 'https://github.com',
        demo: 'https://example.com',
      },
      {
        id: 'p2',
        title: 'Campus Events',
        description: 'A small directory of college club events with filters for date and category.',
        repo: 'https://github.com',
        demo: '',
      },
    ],
  }
}
