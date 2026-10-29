// Default portfolio data shown in the editor / live preview.

export const STORAGE_KEY = 'portfolio-builder-data-v2'

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

/** Empty starting data for the builder form. */
export function createDefaultData() {
  return {
    templateId: null,
    accent: '#0f766e',
    font: 'inter',
    sectionOrder: [...DEFAULT_SECTIONS],
    profile: {
      name: '',
      headline: '',
      bio: '',
      photo: '',
      email: '',
      github: '',
      linkedin: '',
      location: '',
    },
    skills: [],
    projects: [],
  }
}

/** Generic content used only on template gallery cards. */
export function createGallerySample() {
  return {
    ...createDefaultData(),
    profile: {
      name: 'Your Name',
      headline: 'Your headline',
      bio: 'A short intro about you',
      photo: '',
      email: '',
      github: '',
      linkedin: '',
      location: '',
    },
    skills: ['Skill 1', 'Skill 2', 'Skill 3'],
    projects: [
      {
        id: 'sample-1',
        title: 'Project title',
        description: 'A short description of this project.',
        repo: '',
        demo: '',
      },
    ],
  }
}
