import { useState } from 'react'
import { CheckIcon, EditIcon, DeleteIcon, PlusIcon } from '../components/Icons'
import './IdeasScreen.css'

export default function IdeasScreen({ state, update }) {
  const [editMode, setEditMode] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const dreams = state.dreams
  const doneCount = dreams.filter((d) => d.done).length

  const toggle = (id) => {
    if (editMode) return
    update({ dreams: dreams.map((d) => d.id === id ? { ...d, done: !d.done } : d) })
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('light')
  }
  const remove = (id) => update({ dreams: dreams.filter((d) => d.id !== id) })
  const add = () => {
    const v = newText.trim()
    if (!v) { setAdding(false); return }
    update({ dreams: [...dreams, { id: Date.now(), text: v, done: false }] })
    setNewText('')
    setAdding(false)
  }
  const startEdit = (d) => { setEditingId(d.id); setEditText(d.text) }
  const saveEdit = () => {
    const v = editText.trim()
    if (v) update({ dreams: dreams.map((d) => d.id === editingId ? { ...d, text: v } : d) })
    setEditingId(null)
  }

  return (
    <div className="ideas-screen fade-in">
      <div className="glow green" />

      <div className="screen-header">
        <span className="screen-kicker">Мечты</span>
        <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Готово' : 'Изменить'}
        </button>
      </div>

      <div className="ideas-head">
        <h1>Наши мечты</h1>
        <p>{dreams.length} идей · {doneCount} воплощено{editMode ? ' · правка' : ''}</p>
      </div>

      <div className="ideas-list">
        {dreams.map((d) => (
          <div key={d.id} className={`dream ${d.done ? 'done' : ''}`}>
            {editingId === d.id ? (
              <input
                className="dream-edit-input"
                value={editText}
                autoFocus
                onChange={(e) => setEditText(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              />
            ) : (
              <>
                <button className="dream-box" onClick={() => toggle(d.id)}>
                  {d.done && <CheckIcon />}
                </button>
                <span className="dream-text">{d.text}</span>
                {editMode ? (
                  <div className="dream-acts">
                    <button className="dream-act e" onClick={() => startEdit(d)}><EditIcon /></button>
                    <button className="dream-act d" onClick={() => remove(d.id)}><DeleteIcon /></button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        ))}

        {adding ? (
          <div className="dream adding">
            <input
              className="dream-edit-input"
              placeholder="Новая мечта…"
              value={newText}
              autoFocus
              onChange={(e) => setNewText(e.target.value)}
              onBlur={add}
              onKeyDown={(e) => e.key === 'Enter' && add()}
            />
          </div>
        ) : (
          <button className="dream-add" onClick={() => setAdding(true)}>
            <PlusIcon /> Добавить мечту
          </button>
        )}
      </div>
    </div>
  )
}
