import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Landing.css'

const STEPS = [
  { n: '1', title: 'Choose a template', text: 'Pick Minimalist, Tech Developer or Creative as your starting look.' },
  { n: '2', title: 'Enter your details', text: 'Add your name, bio, photo, skills and projects in a simple form.' },
  { n: '3', title: 'Preview and customize', text: 'See a live preview and tweak colour, font and section order.' },
  { n: '4', title: 'Download your portfolio', text: 'Export a ZIP with HTML and CSS, ready to open or host anywhere.' },
]

const FEATURES = [
  { title: '3 templates', text: 'Minimalist, Tech Developer and Creative — hover to preview, then pick one.' },
  { title: 'Live preview', text: 'The right-hand preview updates on every keystroke as you fill in the form.' },
  { title: 'Colour, font and section options', text: 'Change accent colour, typeface and the order of About, Skills, Projects and Contact.' },
  { title: 'Responsive design', text: 'Your site looks good on phones and desktops, including a mobile preview before you export.' },
  { title: 'Download as ZIP', text: 'Get index.html, style.css and assets — no server needed, works by double-clicking.' },
  { title: 'Save and edit later', text: 'Create an account so you can come back and update your portfolio (coming next).' },
]

const FAQS = [
  {
    q: 'Do I need to know how to code?',
    a: 'No. You fill in a form, preview the result, and download a finished website.',
  },
  {
    q: 'What do I get when I download?',
    a: 'A ZIP with standalone HTML and CSS you can open locally or host on GitHub Pages or Vercel.',
  },
  {
    q: 'Can I change the look after I pick a template?',
    a: 'Yes. You can switch template, accent colour, font and section order in the builder.',
  },
  {
    q: 'Is an account required?',
    a: 'Register to get started. Saving portfolios to your account is coming soon; download already works in the builder.',
  },
]

export default function Landing() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="landing">
      <header className="land-header">
        <Link to="/" className="land-logo">
          Portfolio Builder
        </Link>
        <nav className="land-nav">
          {isAuthenticated ? (
            <>
              <span className="user-greeting">Hi, {user?.name}</span>
              <Link className="btn" to="/templates">
                Templates
              </Link>
              <button type="button" className="btn ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn ghost" to="/login">
                Login
              </Link>
              <Link className="btn" to="/register">
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="land-hero">
        <p className="brand">No coding required</p>
        <h1>Create a personal portfolio website in minutes</h1>
        <p className="lede">
          Pick a template, add your details, and download a ready-to-host site — no coding.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <>
              <Link className="btn" to="/templates">
                Browse templates
              </Link>
              <Link className="btn ghost" to="/builder">
                Go to builder
              </Link>
            </>
          ) : (
            <>
              <Link className="btn" to="/register">
                Get started
              </Link>
              <Link className="btn ghost" to="/login">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="land-section">
        <h2>How it works</h2>
        <ol className="steps">
          {STEPS.map((step) => (
            <li key={step.n}>
              <span className="step-n">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="land-section alt">
        <h2>Features</h2>
        <div className="features">
          {FEATURES.map((item) => (
            <article key={item.title} className="feature-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="land-section">
        <h2>FAQ</h2>
        <div className="faq">
          {FAQS.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="land-footer">
        <p>Portfolio Builder — personal sites without writing code.</p>
        <p className="muted">© {new Date().getFullYear()} Portfolio Builder</p>
      </footer>
    </div>
  )
}
