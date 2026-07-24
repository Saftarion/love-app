import { useState } from 'react'
import { PALETTES, conicGradient, segColor } from '../lib/palettes'
import { DeleteIcon, PlusIcon } from '../components/Icons'
import './WheelEditSheet.css'

export default function WheelEditSheet({ state, update, onClose }) {
  const [newItem, setNewItem] = useState('')
  const options = state.wheelOptions
  const palette = PALETTES[state.wheelPalette] || PALETTES.sunset

  const removeOption = (i) => {
    update({ wheelOptions: options.filter((_, idx) => idx !== i) })
  }
  const addOption = () => {
    const v = newItem.trim()
    if (!v) return
    update({ wheelOptions: [...options, v] })
    setNewItem('')
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber" />
        <h2 className="sheet-title">Колесо</h2>

        <div
          className="we-ring"
          style={{
            background: conicGradient(palette.colors, Math.max(options.length, 1)),
          }}
        />

        <div className="set-label">Цветовая тема</div>
        <div className="we-palettes">
          {Object.entries(PALETTES).map(([key, p]) => (
            <button
              key={key}
              className={`we-pal ${state.wheelPalette === key ? 'sel' : ''}`}
              onClick={() => update({ wheelPalette: key })}
            >
              <span
                className="we-swatch"
                style={{ background: conicGradient(p.colors, 6) }}
              />
              <span className="we-pal-name">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="set-label">Варианты</div>
        <div className="we-list">
          {options.map((opt, i) => (
            <div key={i} className="we-item">
              <span className="we-dot" style={{ background: segColor(palette.colors, i) }} />
              <span className="we-name">{opt}</span>
              <button className="we-del" onClick={() => removeOption(i)}>
                <DeleteIcon />
              </button>
            </div>
          ))}

          <div className="we-add">
            <input
              className="we-add-input"
              placeholder="Добавить вариант…"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOption()}
            />
            <button className="we-add-btn" onClick={addOption}>
              <PlusIcon />
            </button>
          </div>
        </div>

        <button className="btn set-done" onClick={onClose}>Готово</button>
      </div>
    </div>
  )
}
