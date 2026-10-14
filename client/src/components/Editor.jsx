import EditorForm from './EditorForm'
import LivePreview from './LivePreview'
import './Editor.css'

export default function Editor({ data, patch, patchProfile, onChangeTemplate, onPreview }) {
  return (
    <div className="editor">
      <header className="editor-top">
        <div>
          <p className="brand">Portfolio Builder</p>
          <strong>{data.profile.name || 'Untitled portfolio'}</strong>
        </div>
        <div className="editor-actions">
          <button type="button" className="ghost" onClick={onChangeTemplate}>
            Change template
          </button>
          <button type="button" onClick={onPreview}>
            Full-screen preview
          </button>
        </div>
      </header>

      <div className="split">
        <aside className="form-pane">
          <EditorForm data={data} patch={patch} patchProfile={patchProfile} />
        </aside>
        <section className="preview-pane">
          <LivePreview data={data} />
        </section>
      </div>
    </div>
  )
}
