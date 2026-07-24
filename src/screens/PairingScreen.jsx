import { useState, useEffect } from 'react'
import { LinkIcon } from '../components/Icons'
import { api } from '../lib/api'
import './PairingScreen.css'

export default function PairingScreen({ onPaired }) {
  const [link, setLink] = useState(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api.createInvite()
      .then((res) => {
        if (cancelled) return
        if (res.inviteLink) setLink(res.inviteLink)
        else setError('Не удалось создать приглашение')
      })
      .catch(() => !cancelled && setError('Нет связи с сервером'))
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!link) return
    const id = setInterval(async () => {
      try {
        const res = await api.getState()
        if (res.paired) { clearInterval(id); onPaired(res.pair) }
      } catch { /* тихо повторим на следующем тике */ }
    }, 3000)
    return () => clearInterval(id)
  }, [link, onPaired])

  const copy = () => {
    navigator.clipboard?.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const share = () => {
    const tg = window.Telegram?.WebApp
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Присоединяйся к нам 💕')}`
    if (tg?.openTelegramLink) tg.openTelegramLink(shareUrl)
    else window.open(shareUrl, '_blank')
  }

  return (
    <div className="pairing-screen fade-in">
      <div className="glow pink" />
      <div className="pairing-body">
        <div className="pairing-hearts">
          <div className="pairing-av l" />
          <div className="pairing-link-ico"><LinkIcon /></div>
          <div className="pairing-av r" />
        </div>
        <h1>Свяжите сердца</h1>
        <p>Отправь ссылку любимой. Как только она откроет — ваши профили соединятся, и всё будет общим.</p>

        {error && <div className="pairing-error">{error}</div>}

        {link && (
          <div className="glass pairing-card">
            <div className="pairing-label">Ваша ссылка-приглашение</div>
            <div className="pairing-linkrow">
              <div className="pairing-url">{link}</div>
              <button className="pairing-copy" onClick={copy}>{copied ? '✓' : 'Копир.'}</button>
            </div>
            <button className="btn pairing-send" onClick={share}>Отправить приглашение</button>
          </div>
        )}

        <div className="pairing-status"><span className="pairing-pulse" />Ожидаем, когда любимая подключится…</div>
      </div>
    </div>
  )
}
