// Shared CSS for the exported site and the live iframe preview.
// One HTML structure, three looks via body[data-template].

export function buildPortfolioCss({ accent, fontFamily }) {
  return `:root {
  --accent: ${accent};
  --font: ${fontFamily};
  --text: #1f2937;
  --muted: #6b7280;
  --line: #e5e7eb;
  --card: #ffffff;
  --bg: #f8faf9;
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--font);
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
}

img { max-width: 100%; display: block; }
a { color: var(--accent); }
.wrap { width: min(1080px, calc(100% - 40px)); margin: 0 auto; }
.muted { color: var(--muted); }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.92rem;
  border: 1px solid var(--line);
  color: var(--text);
  background: var(--card);
}
.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.hero { padding: 64px 0 32px; }
.hero-inner { display: grid; gap: 28px; align-items: center; }
.avatar {
  width: 148px;
  height: 148px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--accent);
  background: #d1fae5;
}
.avatar.placeholder {
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 2rem;
  color: var(--accent);
}
.eyebrow { letter-spacing: 0.16em; text-transform: uppercase; font-size: 0.72rem; color: var(--accent); margin: 0 0 8px; }
h1 { font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1.1; margin: 0 0 10px; }
.headline { font-size: 1.15rem; margin: 0 0 16px; color: var(--muted); }
.links { display: flex; flex-wrap: wrap; gap: 10px; }

section { padding: 28px 0 12px; }
section h2 {
  font-size: 1.35rem;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--accent);
  display: inline-block;
}

.bio { max-width: 68ch; font-size: 1.05rem; }

.skills { display: flex; flex-wrap: wrap; gap: 10px; padding: 0; margin: 0; list-style: none; }
.skills li {
  background: color-mix(in srgb, var(--accent) 12%, white);
  color: #115e59;
  border: 1px solid color-mix(in srgb, var(--accent) 28%, white);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.92rem;
}

.projects { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.project {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.project h3 { margin: 0; font-size: 1.12rem; }
.project p { margin: 0; color: var(--muted); flex: 1; }
.project-links { display: flex; gap: 8px; flex-wrap: wrap; }

.contact-list { display: grid; gap: 6px; }
.contact-list a { text-decoration: none; }
.site-foot { padding: 40px 0 48px; color: var(--muted); font-size: 0.9rem; }

@media (min-width: 720px) {
  .hero-inner { grid-template-columns: auto 1fr; }
}

/* ----- Minimalist ----- */
body[data-template="minimalist"] {
  --bg: #ffffff;
  --text: #111827;
}
body[data-template="minimalist"] .wrap { width: min(740px, calc(100% - 48px)); }
body[data-template="minimalist"] .hero { padding-top: 80px; }
body[data-template="minimalist"] .hero-inner { grid-template-columns: 1fr; justify-items: start; }
body[data-template="minimalist"] h1 { font-weight: 600; letter-spacing: -0.03em; }
body[data-template="minimalist"] section h2 { border-bottom: 1px solid var(--text); padding-bottom: 4px; }
body[data-template="minimalist"] .projects { grid-template-columns: 1fr; }
body[data-template="minimalist"] .project {
  border: none;
  border-top: 1px solid var(--line);
  border-radius: 0;
  padding: 20px 0;
  background: transparent;
}
body[data-template="minimalist"] .skills li {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0 12px 0 0;
  color: var(--text);
}
body[data-template="minimalist"] .skills li:not(:last-child)::after {
  content: "·";
  margin-left: 12px;
  color: var(--accent);
}

/* ----- Tech Developer ----- */
body[data-template="tech"] {
  --bg: #07141c;
  --text: #e5f8f4;
  --muted: #93b0ab;
  --line: #1d3a3a;
  --card: #0c1f28;
}
body[data-template="tech"] .eyebrow::before { content: "> "; }
body[data-template="tech"] h1 { font-weight: 700; }
body[data-template="tech"] .avatar { border-radius: 12px; border-width: 2px; }
body[data-template="tech"] section h2 { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 0.95rem; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: none; }
body[data-template="tech"] section h2::before { content: "// "; color: var(--accent); }
body[data-template="tech"] .project { border-color: #1f4a4a; box-shadow: 0 0 0 1px #0b2a2a inset; }
body[data-template="tech"] .skills li { background: #10332f; color: #99f6e4; border-color: #134e4a; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 0.8rem; }
body[data-template="tech"] .btn { background: #0c1f28; color: var(--text); border-color: #1f4a4a; }
body[data-template="tech"] .btn.primary { background: var(--accent); color: #042f2e; }

/* ----- Creative ----- */
body[data-template="creative"] {
  --bg: #f3fbf9;
  --text: #134e4a;
}
body[data-template="creative"] .hero {
  padding-top: 48px;
}
body[data-template="creative"] .hero-inner {
  background: #fff;
  border-radius: 28px;
  padding: 32px;
  border: 2px solid #ccfbf1;
  box-shadow: 12px 12px 0 color-mix(in srgb, var(--accent) 35%, white);
}
body[data-template="creative"] h1 {
  font-weight: 700;
  letter-spacing: -0.04em;
}
body[data-template="creative"] .avatar {
  width: 170px;
  height: 170px;
  border-radius: 28px;
  transform: rotate(-4deg);
}
body[data-template="creative"] .project {
  border: 2px solid #99f6e4;
  border-radius: 22px;
}
body[data-template="creative"] .project:nth-child(2n) { transform: rotate(0.6deg); }
body[data-template="creative"] .project:nth-child(2n+1) { transform: rotate(-0.6deg); }
body[data-template="creative"] .skills li { border-radius: 12px; font-weight: 600; }

@media (max-width: 640px) {
  .hero { padding-top: 36px; }
  .avatar { width: 112px; height: 112px; }
  body[data-template="creative"] .hero-inner { padding: 20px; box-shadow: 6px 6px 0 color-mix(in srgb, var(--accent) 35%, white); }
}
`
}
