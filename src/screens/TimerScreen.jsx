import { useState, useEffect } from 'react'
import { quoteOfTheDay } from '../lib/quotes'
import { SettingsIcon, QuoteIcon } from '../components/Icons'
import SettingsSheet from './SettingsSheet'
import './TimerScreen.css'

function diffParts(startDate) {
  const start = new Date(startDate + 'T00:00:00')
  const now = new Date()
  let ms = Math.max(0, now - start)
  const days = Math.floor(ms / 86400000); ms -= days * 86400000
  const hours = Math.floor(ms / 3600000); ms -= hours * 3600000
  const minutes = Math.floor(ms / 60000); ms -= minutes * 60000
  const seconds = Math.floor(ms / 1000)
  return { days, hours, minutes, seconds }
}

export default function TimerScreen({ state, update }) {
  const [t, setT] = useState(() => diffParts(state.startDate))
  const [showSettings, setShowSettings] = useState(false)
  const quote = quoteOfTheDay()

  useEffect(() => {
    const id = setInterval(() => setT(diffParts(state.startDate)), 1000)
    return () => clearInterval(id)
  }, [state.startDate])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="timer-screen fade-in">
      <div className="glow pink" />

      <div className="screen-header">
        <span className="screen-kicker">{state.eventName}</span>
        <button className="icon-btn" onClick={() => setShowSettings(true)}>
          <SettingsIcon />
        </button>
      </div>

      <div className="timer-body">
        <div className="timer-kicker">Мы вместе уже</div>
        <div className="timer-big">{t.days}</div>
        <div className="timer-word">{dayWord(t.days)}</div>

        <div className="glass timer-cells">
          <Cell n={pad(t.hours)} l="часов" divider />
          <Cell n={pad(t.minutes)} l="минуты" divider />
          <Cell n={pad(t.seconds)} l="секунд" />
        </div>

        <div className="glass timer-quote">
          <div className="quote-badge"><QuoteIcon /></div>
          <p>{quote.text}</p>
          <div className="quote-author">— {quote.author}</div>
        </div>
      </div>

      {showSettings && (
        <SettingsSheet state={state} update={update} onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

function Cell({ n, l, divider }) {
  return (
    <div className={`timer-cell ${divider ? 'divider' : ''}`}>
      <div className="cell-n">{n}</div>
      <div className="cell-l">{l}</div>
    </div>
  )
}

// склонение слова "день"
function dayWord(n) {
  const d10 = n % 10, d100 = n % 100
  if (d100 >= 11 && d100 <= 14) return 'дней'
  if (d10 === 1) return 'день'
  if (d10 >= 2 && d10 <= 4) return 'дня'
  return 'дней'
}
