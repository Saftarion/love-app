import { useState, useRef } from 'react'
import { PALETTES, conicGradient } from '../lib/palettes'
import { EditIcon } from '../components/Icons'
import WheelEditSheet from './WheelEditSheet'
import './SpinScreen.css'

export default function SpinScreen({ state, update }) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const rotationRef = useRef(0)
  const ringRef = useRef(null)

  const options = state.wheelOptions
  const palette = PALETTES[state.wheelPalette] || PALETTES.sunset
  const gradient = conicGradient(palette.colors, Math.max(options.length, 1))

  const spin = () => {
    if (spinning || options.length === 0) return
    setSpinning(true)
    setShowResult(false)
    setResult(null)

    const idx = Math.floor(Math.random() * options.length)
    const seg = 360 / options.length
    const extra = 4 + Math.floor(Math.random() * 3)
    // остановить указатель (сверху) на выбранном секторе
    const target = 360 * extra + (360 - (idx * seg + seg / 2))
    rotationRef.current += target

    const ring = ringRef.current
    if (ring) {
      ring.style.transition = 'transform 3.2s cubic-bezier(.15,.85,.25,1)'
      ring.style.transform = `rotate(${rotationRef.current}deg)`
    }

    const haptic = window.Telegram?.WebApp?.HapticFeedback
    haptic?.impactOccurred?.('medium')

    setTimeout(() => {
      setResult(options[idx])
      setShowResult(true)
      setSpinning(false)
      haptic?.notificationOccurred?.('success')
    }, 3300)
  }

  const addToDreams = () => {
    if (!result) return
    const exists = state.dreams.some((d) => d.text === result)
    if (!exists) {
      update({ dreams: [...state.dreams, { id: Date.now(), text: result, done: false }] })
    }
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('light')
  }

  return (
    <div className="spin-screen fade-in">
      <div className="glow blue" />

      <div className="screen-header">
        <span className="screen-kicker">Спонтанность</span>
        <button className="icon-btn" onClick={() => setShowEdit(true)}>
          <EditIcon />
        </button>
      </div>

      <div className="spin-body">
        <div className="spin-title">{showResult ? 'Выпало!' : 'Что сегодня?'}</div>
        <div className="spin-sub">{showResult ? result : 'Крутани и узнай'}</div>

        <div className={`wheel-stage ${spinning ? 'growing' : ''}`}>
          <div className="wheel-pointer" />
          <div className="wheel-ring" ref={ringRef} style={{ background: gradient }} />
          <div className="wheel-center">
            <div className={`wheel-result ${showResult ? 'show' : ''}`}>
              {result || '?'}
            </div>
          </div>
        </div>

        {showResult ? (
          <div className="spin-actions">
            <button className="btn ghost" onClick={spin}>Ещё раз</button>
            <button className="btn" onClick={addToDreams}>В мечты</button>
          </div>
        ) : (
          <button className="btn spin-btn" onClick={spin} disabled={spinning || options.length === 0}>
            {spinning ? 'Крутится…' : 'КРУТИТЬ'}
          </button>
        )}
      </div>

      {showEdit && (
        <WheelEditSheet state={state} update={update} onClose={() => setShowEdit(false)} />
      )}
    </div>
  )
}
