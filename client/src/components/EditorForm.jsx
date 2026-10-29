import { ACCENT_PRESETS, FONTS, SECTION_META } from '../data/defaults'
import { resizeImageFile } from '../data/storage'

function Field({ label, hint, children }) {
  return (
    <label>
      {label}
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  )
}

export default function EditorForm({ data, patch, patchProfile }) {
  const { profile, skills, projects } = data

  async function onPhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const photo = await resizeImageFile(file)
      patchProfile({ photo })
    } catch {
      alert('Could not read that image. Try a JPG or PNG.')
    }
  }

  function addSkill(event) {
    event.preventDefault()
    const input = event.currentTarget.elements.skill
    const value = input.value.trim()
    if (!value || skills.includes(value)) {
      input.value = ''
      return
    }
    patch({ skills: [...skills, value] })
    input.value = ''
  }

  function removeSkill(tag) {
    patch({ skills: skills.filter((s) => s !== tag) })
  }

  function updateProject(id, field, value) {
    patch({
      projects: projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    })
  }

  function addProject() {
    patch({
      projects: [
        ...projects,
        { id: crypto.randomUUID(), title: '', description: '', repo: '', demo: '' },
      ],
    })
  }

  function removeProject(id) {
    patch({ projects: projects.filter((p) => p.id !== id) })
  }

  function moveSection(index, dir) {
    const next = [...data.sectionOrder]
    const swap = index + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[index], next[swap]] = [next[swap], next[index]]
    patch({ sectionOrder: next })
  }

  return (
    <div className="form-stack">
      <section className="panel how-it-works">
        <h3>How it works</h3>
        <p>
          Fill in your details on the left. The live preview on the right updates as you type.
          When you are happy with it, use Generate Portfolio to download a ZIP of your site.
        </p>
      </section>

      <section className="panel">
        <h3>Profile</h3>
        <Field label="Name" hint="Enter your full name, e.g. Priya Sharma">
          <input
            value={profile.name}
            placeholder="Your full name"
            onChange={(e) => patchProfile({ name: e.target.value })}
          />
        </Field>
        <Field label="Headline" hint="One line about what you do, e.g. Web developer and CS student">
          <input
            value={profile.headline}
            placeholder="One line about what you do"
            onChange={(e) => patchProfile({ headline: e.target.value })}
          />
        </Field>
        <Field label="Bio" hint="Write 2-3 sentences about yourself, your interests and goals">
          <textarea
            rows={5}
            value={profile.bio}
            placeholder="A short intro about you"
            onChange={(e) => patchProfile({ bio: e.target.value })}
          />
        </Field>
        <Field label="Photo" hint="Upload a clear, square photo of your face (JPG or PNG)">
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhoto} />
        </Field>
        {profile.photo ? (
          <button type="button" className="ghost" onClick={() => patchProfile({ photo: '' })}>
            Remove photo
          </button>
        ) : null}
      </section>

      <section className="panel">
        <h3>Contact</h3>
        <Field label="Email" hint="The address visitors can use to reach you">
          <input
            type="email"
            value={profile.email}
            placeholder="you@example.com"
            onChange={(e) => patchProfile({ email: e.target.value })}
          />
        </Field>
        <Field label="GitHub" hint="Full URL to your GitHub profile, if you have one">
          <input
            value={profile.github}
            placeholder="https://github.com/username"
            onChange={(e) => patchProfile({ github: e.target.value })}
          />
        </Field>
        <Field label="LinkedIn" hint="Full URL to your LinkedIn profile">
          <input
            value={profile.linkedin}
            placeholder="https://linkedin.com/in/username"
            onChange={(e) => patchProfile({ linkedin: e.target.value })}
          />
        </Field>
        <Field label="Location" hint="City or country, shown on the contact section">
          <input
            value={profile.location}
            placeholder="City, country"
            onChange={(e) => patchProfile({ location: e.target.value })}
          />
        </Field>
      </section>

      <section className="panel">
        <h3>Skills</h3>
        <p className="field-hint">Type a skill and press Enter. Click a tag to remove it.</p>
        <div className="tag-row">
          {skills.map((tag) => (
            <button key={tag} type="button" className="tag" onClick={() => removeSkill(tag)}>
              {tag} ×
            </button>
          ))}
        </div>
        <form className="inline-add" onSubmit={addSkill}>
          <input name="skill" placeholder="Type a skill and press Enter" />
          <button type="submit">Add</button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>Projects</h3>
          <button type="button" className="ghost" onClick={addProject}>
            + Add project
          </button>
        </div>
        <p className="field-hint">Add each project with a title, a short description and links.</p>
        {projects.length === 0 ? (
          <p className="empty-note">No projects yet. Click “Add project” to create one.</p>
        ) : null}
        {projects.map((project, index) => (
          <div className="project-edit" key={project.id}>
            <p className="project-label">Project {index + 1}</p>
            <Field label="Title" hint="A short, clear name for this project">
              <input
                value={project.title}
                placeholder="Project title"
                onChange={(e) => updateProject(project.id, 'title', e.target.value)}
              />
            </Field>
            <Field label="Description" hint="One or two sentences about what you built">
              <textarea
                rows={3}
                value={project.description}
                placeholder="A short description of this project"
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              />
            </Field>
            <Field label="Repo link" hint="Link to the GitHub repository (optional)">
              <input
                value={project.repo}
                placeholder="https://github.com/username/repo"
                onChange={(e) => updateProject(project.id, 'repo', e.target.value)}
              />
            </Field>
            <Field label="Demo link" hint="Link to a live demo, if you have one (optional)">
              <input
                value={project.demo}
                placeholder="https://your-demo.example"
                onChange={(e) => updateProject(project.id, 'demo', e.target.value)}
              />
            </Field>
            <button type="button" className="ghost danger" onClick={() => removeProject(project.id)}>
              Remove project
            </button>
          </div>
        ))}
      </section>

      <section className="panel">
        <h3>Look &amp; layout</h3>
        <p className="hint">Accent colour</p>
        <p className="field-hint">Pick a highlight colour for buttons, links and headings.</p>
        <div className="swatches">
          {ACCENT_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              className={data.accent === color ? 'swatch on' : 'swatch'}
              style={{ background: color }}
              aria-label={color}
              onClick={() => patch({ accent: color })}
            />
          ))}
          <label className="custom-color">
            Custom
            <input
              type="color"
              value={data.accent}
              onChange={(e) => patch({ accent: e.target.value })}
            />
          </label>
        </div>

        <Field label="Font" hint="Choose the typeface used across your portfolio.">
          <select value={data.font} onChange={(e) => patch({ font: e.target.value })}>
            {FONTS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>
        </Field>

        <p className="hint">Section order</p>
        <p className="field-hint">Use the arrows to change the order of About, Skills, Projects and Contact.</p>
        <ul className="order-list">
          {data.sectionOrder.map((id, index) => (
            <li key={id}>
              <span>{SECTION_META[id]?.label ?? id}</span>
              <span className="order-btns">
                <button type="button" onClick={() => moveSection(index, -1)} aria-label="Move up">
                  ↑
                </button>
                <button type="button" onClick={() => moveSection(index, 1)} aria-label="Move down">
                  ↓
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
