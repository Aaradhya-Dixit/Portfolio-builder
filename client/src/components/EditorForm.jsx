import { ACCENT_PRESETS, FONTS, SECTION_META } from '../data/defaults'
import { resizeImageFile } from '../data/storage'

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
      <section className="panel">
        <h3>Profile</h3>
        <label>
          Name
          <input value={profile.name} onChange={(e) => patchProfile({ name: e.target.value })} />
        </label>
        <label>
          Headline
          <input
            value={profile.headline}
            onChange={(e) => patchProfile({ headline: e.target.value })}
          />
        </label>
        <label>
          Bio
          <textarea
            rows={5}
            value={profile.bio}
            onChange={(e) => patchProfile({ bio: e.target.value })}
          />
        </label>
        <label>
          Photo
          <input type="file" accept="image/*" onChange={onPhoto} />
        </label>
        {profile.photo ? (
          <button type="button" className="ghost" onClick={() => patchProfile({ photo: '' })}>
            Remove photo
          </button>
        ) : null}
      </section>

      <section className="panel">
        <h3>Contact</h3>
        <label>
          Email
          <input
            type="email"
            value={profile.email}
            onChange={(e) => patchProfile({ email: e.target.value })}
          />
        </label>
        <label>
          GitHub
          <input value={profile.github} onChange={(e) => patchProfile({ github: e.target.value })} />
        </label>
        <label>
          LinkedIn
          <input
            value={profile.linkedin}
            onChange={(e) => patchProfile({ linkedin: e.target.value })}
          />
        </label>
        <label>
          Location
          <input
            value={profile.location}
            onChange={(e) => patchProfile({ location: e.target.value })}
          />
        </label>
      </section>

      <section className="panel">
        <h3>Skills</h3>
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
        {projects.map((project) => (
          <div className="project-edit" key={project.id}>
            <label>
              Title
              <input
                value={project.title}
                onChange={(e) => updateProject(project.id, 'title', e.target.value)}
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              />
            </label>
            <label>
              Repo link
              <input
                value={project.repo}
                onChange={(e) => updateProject(project.id, 'repo', e.target.value)}
              />
            </label>
            <label>
              Demo link
              <input
                value={project.demo}
                onChange={(e) => updateProject(project.id, 'demo', e.target.value)}
              />
            </label>
            <button type="button" className="ghost danger" onClick={() => removeProject(project.id)}>
              Remove project
            </button>
          </div>
        ))}
      </section>

      <section className="panel">
        <h3>Look &amp; layout</h3>
        <p className="hint">Accent colour</p>
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

        <label>
          Font
          <select value={data.font} onChange={(e) => patch({ font: e.target.value })}>
            {FONTS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>
        </label>

        <p className="hint">Section order</p>
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
