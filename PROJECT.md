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
- Frontend: React + Vite in the client/ folder (data in React state + localStorage)
- Backend scaffold: Express + Mongoose in the server/ folder
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
- Backend in server/ (Express + Mongoose): created (health route + Atlas connect)
- ZIP export ("Generate Portfolio"): working (builder header + full-screen preview)
- Desktop/mobile preview toggle: working (full-screen preview)

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
# Portfolio Builder: Progress Log

## Project overview
A web app where users sign up, pick a portfolio template, fill in their details with a live preview, and download the finished portfolio as a ZIP.

**Structure:** `client/` (React frontend) and `server/` (Node/Express backend)
**Style:** teal and white

## Planned page flow
Landing page → Register/Login → Template gallery → Builder (form + live preview) → Download
(plus "My portfolios" for saved ones)

## Completed

### Core app (before auth)
- [x] Template gallery with 3 templates
- [x] Builder with form and live preview
- [x] Colour, font and section order options
- [x] Download portfolio as ZIP

### Auth backend (`server/`)
- [x] User model: name, email (unique), hashed password (bcrypt)
- [x] `POST /api/auth/register`: body `{ name, email, password }`, password min 8 characters
- [x] `POST /api/auth/login`: body `{ email, password }`
- [x] `GET /api/auth/me`: header `Authorization: Bearer <token>`
- [x] Auth middleware that checks the JWT
- [x] Register and login return `{ token, user }`
- [x] `JWT_SECRET` stored in `server/.env` and listed in `.env.example`
- [x] `.env` and `node_modules` added to `.gitignore`

### Auth backend testing (PowerShell, `Invoke-RestMethod`)
- [x] Register returns token and user
- [x] Login returns token
- [x] `/me` with token returns id, name, email
- [x] Duplicate email returns 409
- [x] Short password returns 400
- [x] Wrong password returns 401
- [x] `/me` without token

### Prompt 1: Remove personal sample data and add clear instructions
**Status: DONE**
- [x] Removed the sample name and email from the whole app
- [x] Template previews use generic placeholders ("Your Name", "Your headline", "Skill 1", "Project title")
- [x] Builder starts with empty fields
- [x] Every field has a label, placeholder and helper line
- [x] Colour, font and section order controls have a one-line explanation
- [x] Live preview shows faded placeholder text until the user types
- [x] "How it works" hint at the top of the builder
- [x] Tested and committed: "Add placeholders and instructions"

### Prompt 2: Landing page and routing
**Status: DONE** (finished in Antigravity)
- [x] Landing page at `/` (header, hero, How it works, features, FAQ, footer)
- [x] react-router routes: `/`, `/login`, `/register`, `/templates`, `/builder`
- [x] Placeholder `/login` and `/register` pages
- [x] Landing page responsive on mobile
- [x] Tested and committed: "Add landing page and routing"

### Prompt 3: Login and Register pages
**Status: DONE**
- [x] Real Login and Register pages calling the auth API
- [x] Client-side validation and server error messages
- [x] AuthContext (user, token, login, register, logout), session restored via `/api/auth/me`
- [x] ProtectedRoute for `/templates` and `/builder`
- [x] Logged-in users redirected away from `/login` and `/register`
- [x] Logout button and user's name in the header
- [x] API URL in an environment variable (`VITE_API_URL`)
- [x] CORS verified and active on the server
- [x] Built and verified

### Prompt 4: Portfolio backend (server/)
**Status: DONE**
- [x] Portfolio model: owner (ref to User, required), title, template, data, design, photo, timestamps
- [x] Protected routes: POST, GET (list mine), GET one, PUT, DELETE under /api/portfolios
- [x] Ownership enforcement on all routes (404 on missing or unauthorized access)
- [x] Validation and size limits (title, template, photo under 1 MB, valid ObjectId)
- [x] Express JSON body limit raised to 5mb
- [x] Tested with PowerShell: "Add portfolio API"

### Prompt 5: Portfolio frontend (client/)
**Status: DONE**
- [x] Save button in the builder (creates new with POST /api/portfolios, or updates with PUT /api/portfolios/:id)
- [x] "My portfolios" page at /portfolios (lists user's portfolios, Edit, Delete, Download)
- [x] Editing loads saved data into the builder via /builder/:id
- [x] Empty state, loading state, error messages, delete confirmation
- [x] "My portfolios" link in the header for logged-in users
- [x] Photos resized in browser via canvas (< 600px wide, JPEG ~0.8 quality, under 1 MB check)
- [x] Built and verified

## Decisions
- Photos stored as compressed base64 in the portfolio document (max about 1 MB). Revisit Cloudinary at deployment.

## Next steps
1. Polish and hardening (rate limiting, helmet, validation)
2. Deployment
3. README and resume prep
## Done
- [x] Prompt 4: Portfolio backend
- [x] Prompt 5: Portfolio frontend (save, load, edit, download, delete; per-user drafts fixed)
- [x] Prompt 6: Security hardening (helmet, rate limiting, CORS CLIENT_URL, startup checks, central error handling, body size limit, centralized API URL)

## In progress

### Ready for Next Phase

## Next steps
1. Deployment (Render / Vercel)
2. README and resume prep