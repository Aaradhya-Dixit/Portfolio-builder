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
## Phase 2 scope
- Backend in server/: Node + Express + MongoDB (Atlas) with Mongoose
- Auth: register/login with hashed passwords (bcrypt) and JWT
- Each user can save, load, edit and delete their own portfolios
- Frontend: Login/Register pages, protected builder, "My portfolios" page
- Download mode: logged-in user downloads the finished portfolio as ZIP
- Secrets go in .env (never commit it)
## Progress (updated Oct 29, 2026)

### Done
- Frontend in client/ (React + Vite): template gallery with 3 templates
  (Minimalist, Tech Developer, Creative), details form (profile, photo,
  contact, skills tags, projects), live preview, accent colour, font and
  section order options, full-screen preview
- Git repo set up and committed
- MongoDB Atlas cluster created (free M0), connection string saved in
  server/.env as MONGO_URI (never commit .env)

### In progress / not verified
- Backend in server/ (Express + Mongoose): [fill in: created or not yet]
- ZIP export ("Generate Portfolio"): [fill in: working / not working / not built]
- Desktop/mobile preview toggle: [fill in]

### Folder structure
- client/  React + Vite frontend
- server/  Express backend (.env holds MONGO_URI)
- PROJECT.md  project description

### How to run
- Frontend: cd client, npm install, npm run dev (http://localhost:5173)
- Backend: cd server, npm install, npm run dev

### Next steps
1. Finish backend setup and check /api/health works
2. Auth: register/login with bcrypt + JWT
3. Save/load/delete portfolios per user
4. Login/Register pages and "My portfolios" page in the frontend
5. Download mode: ZIP with index.html, style.css, assets