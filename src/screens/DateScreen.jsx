import { useState } from 'react'
import { HeartIcon, CalendarIcon, MapPinIcon, MessageIcon, SendIcon } from '../components/Icons'
import { api } from '../lib/api'
import './DateScreen.css'

const PRESETS = ['Сегодня вечером', 'Завтра', 'На выходных', 'Своя дата']

export default function DateScreen({ inTg, paired, partnerName }) {
  const [preset, setPreset] = useState(PRESETS[0])
  const [place, setPlace] = useState('')
  const [message, setMessage] = useState('Соскучился, идём гулять?')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const canSend = inTg && paired

  const invite = async () => {
    if (!canSend || sending) return
    setSending(true)
    setError(null)
    try {
      const res = await api.sendDateInvite({ when: preset, place, message })
      if (res.ok) {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success')
        setSent(true)
        setTimeout(() => setSent(false), 2600)
      } else {
        setError(res.error === 'partner unreachable' ? 'Партнёр ещё не открывал бота — попроси её нажать /start' : 'Не получилось отправить')
      }
    } catch {
      setError('Нет связи с сервером')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="date-screen fade-in">
      <div className="glow pink" style={{ top: 0, height: 420 }} />

      <div className="date-top">Свидание</div>

      <div className="date-head">
        <div className="date-heart"><HeartIcon /></div>
        <h1>{partnerName ? `Позови ${partnerName} на свидание` : 'Позови её на свидание'}</h1>
        <p>
          {canSend
            ? 'Она сразу получит уведомление в Telegram с приглашением'
            : 'Доступно после связки с партнёром на главном экране'}
        </p>
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

      <button
        className={`btn date-btn ${sent ? 'sent' : ''}`}
        onClick={invite}
        disabled={!canSend || sending || sent}
      >
        {sent ? 'Отправлено ❤' : sending ? 'Отправляем…' : <><SendIcon /> Позвать</>}
      </button>
      <div className="date-fine">
        {error || (sent ? 'Приглашение улетело в Telegram' : canSend ? 'Придёт push прямо в её Telegram' : ' ')}
      </div>
    </div>
  )
}
