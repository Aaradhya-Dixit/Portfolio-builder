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
## Prompt 1 (paste into Cursor): Remove personal data and add clear instructions

**Status:** in progress. Tick the boxes above once tested.

**Prompt text:**

```
Remove all personal sample data (the name "Aaradhya", my email, etc.) from the app. In the template gallery, the preview cards should use generic placeholder content like "Your Name", "Your headline", "A short intro about you", sample skills like "Skill 1", and "Project title". In the builder, start with empty fields. Add clear labels, placeholder text and a short helper line under each field, for example: Name: "Enter your full name, e.g. Priya Sharma"; Headline: "One line about what you do, e.g. Web developer and CS student"; Bio: "Write 2-3 sentences about yourself, your interests and goals"; Photo: "Upload a clear, square photo of your face (JPG or PNG)"; Skills: "Type a skill and press Enter"; Projects: "Add each project with a title, a short description and links"; and the colour, font and section order controls get a one-line explanation. In the live preview, show faded placeholder text such as "Your name here" until the user types something. Also add a short "How it works" hint at the top of the builder.
```

**How to test:**
- Search the whole project for "Aaradhya" and your email (Ctrl+Shift+F in Cursor). Nothing should remain.
- Open the template gallery: previews show "Your Name", "Your headline", "Skill 1", "Project title".
- Open the builder: all fields start empty.
- Each field has a label, placeholder and helper line.
- The preview shows faded placeholders until you type.
- The "How it works" hint appears at the top of the builder.

**Commit after testing:**

```
git add .
git commit -m "Add placeholders and instructions"
git push
```

**If something goes wrong:**
- If Cursor changes too much, tell it: "Only do the template gallery first, then stop."
- If your name still appears somewhere, give Cursor the exact file or screen where you see it.
- If Cursor's limit blocks you, tell me and I'll write the code here for you to copy in.
## Completed (continued)

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

## In progress

### Prompt 2: Landing page and routing
- [ ] Landing page at `/` (header, hero, How it works, features, FAQ, footer)
- [ ] react-router routes: `/`, `/login`, `/register`, `/templates`, `/builder`
- [ ] Placeholder `/login` and `/register` pages
- [ ] Tested and committed: "Add landing page and routing"

## Next steps
1. **Prompt 3:** real Login and Register pages, AuthContext, ProtectedRoute for `/templates` and `/builder`, Logout button, API URL in an env variable, CORS
2. Save and load portfolios (per user)
3. Download mode for saved portfolios
4. Deployment (frontend and backend, database hosting, env variables)
## In progress

### Prompt 2: Landing page and routing
**Status: DONE**
- [x] Landing page at `/` (header, hero, How it works, features, FAQ, footer)
- [x] react-router routes: `/`, `/login`, `/register`, `/templates`, `/builder`
- [x] Placeholder `/login` and `/register` pages
- [x] Landing page responsive on mobile
- [x] Tested and verified

**Before continuing, check what already exists:**
- Run `git status` and `git diff` to see which files were changed or added.
- Run the app (`npm run dev` in `client/`) and check for errors.
- Open `/`, `/login`, `/register`, `/templates` and `/builder`.
- Tick the boxes above for whatever already works. Only ask the AI tool to do what's missing.
- If the app is broken, run `git restore .` to go back to the last commit (Prompt 1) and redo Prompt 2 from scratch. Only do this if you don't need any of the partial work.

**Tool note:** switching to a different AI editor after this point, because the Cursor limit was reached. Same project folder, same `PROJECT.md`.

## Next steps
1. Finish Prompt 2 (landing page and routing)
2. **Prompt 3:** real Login and Register pages, AuthContext, ProtectedRoute for `/templates` and `/builder`, Logout button, API URL in an env variable, CORS
3. Save and load portfolios (per user)
4. Download mode for saved portfolios
5. Deployment