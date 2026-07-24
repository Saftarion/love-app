import { useState } from 'react'
import { HeartIcon, CalendarIcon, MapPinIcon, MessageIcon, SendIcon } from '../components/Icons'
import './DateScreen.css'

const PRESETS = ['Сегодня вечером', 'Завтра', 'На выходных', 'Своя дата']

export default function DateScreen() {
  const [preset, setPreset] = useState(PRESETS[0])
  const [place, setPlace] = useState('')
  const [message, setMessage] = useState('Соскучился, идём гулять?')
  const [sent, setSent] = useState(false)

  const invite = () => {
    // Пока без бэкенда: показываем успех + haptic.
    // Позже — POST на сервер, бот шлёт партнёру push в Telegram.
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success')
    setSent(true)
    setTimeout(() => setSent(false), 2600)
  }

  return (
    <div className="date-screen fade-in">
      <div className="glow pink" style={{ top: 0, height: 420 }} />

      <div className="date-top">Свидание</div>

      <div className="date-head">
        <div className="date-heart"><HeartIcon /></div>
        <h1>Позови её на свидание</h1>
        <p>Она сразу получит уведомление в Telegram с приглашением</p>
      </div>

      <div className="date-chips">
        {PRESETS.map((p) => (
          <button
            key={p}
            className={`date-chip ${preset === p ? 'on' : ''}`}
            onClick={() => setPreset(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="glass date-form">
        <div className="date-row">
          <div className="date-ic"><CalendarIcon /></div>
          <div className="date-field">
            <div className="date-l">Когда</div>
            <div className="date-v">{preset}</div>
          </div>
        </div>
        <div className="date-row">
          <div className="date-ic"><MapPinIcon /></div>
          <div className="date-field">
            <div className="date-l">Куда</div>
            <input
              className="date-input"
              placeholder="Добавить место…"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>
        </div>
        <div className="date-row">
          <div className="date-ic"><MessageIcon /></div>
          <div className="date-field">
            <div className="date-l">Сообщение</div>
            <input
              className="date-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button className={`btn date-btn ${sent ? 'sent' : ''}`} onClick={invite} disabled={sent}>
        {sent ? 'Отправлено ❤' : <><SendIcon /> Позвать</>}
      </button>
      <div className="date-fine">
        {sent ? 'Приглашение улетело ей в Telegram' : 'Придёт push прямо в её Telegram'}
      </div>
    </div>
  )
}
