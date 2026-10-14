# Online Portfolio Website Builder

A web tool that lets students and developers create personal portfolio
websites without coding, using ready-made templates.

## User flow
1. Template selection: user lands on the platform, hovers over template
   cards (Minimalist, Tech Developer, Creative) for a preview, and picks one.
2. Personal details: profile and bio (name, headline, bio, photo, contact),
   skills as tags, and projects (title, description, repo link, demo link).
3. Live preview and editing: split screen with the form on the left and a
   live portfolio preview on the right. Updates on every keystroke. Options
   to change accent colour, font and section order.
4. Export: full-screen preview (mobile/desktop), then a "Generate Portfolio"
   button downloads a ZIP with index.html, style.css and assets.

## Key output features
- Fully responsive
- Standalone HTML/CSS, ready for GitHub Pages or Vercel
- PDF resume export (later)

## Current scope (demo)
- Frontend only: React + Vite in the client/ folder
- NO backend yet. Keep all data in React state (and localStorage)
- Clean, modern design: white and teal, simple code with comments