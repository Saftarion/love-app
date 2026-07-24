import { useState, useEffect, useRef, useCallback } from 'react'
import { loadState, saveState } from './lib/storage'
import { api, isInTelegram } from './lib/api'
import TimerScreen from './screens/TimerScreen'
import SpinScreen from './screens/SpinScreen'
import IdeasScreen from './screens/IdeasScreen'
import DateScreen from './screens/DateScreen'
import PairingScreen from './screens/PairingScreen'
import { HomeIcon, WheelIcon, LightbulbIcon, HeartIcon } from './components/Icons'

const TABS = [
  { id: 'timer', Icon: HomeIcon },
  { id: 'spin', Icon: WheelIcon },
  { id: 'ideas', Icon: LightbulbIcon },
  { id: 'date', Icon: HeartIcon },
]

const SYNCED_KEYS = ['startDate', 'eventName', 'wheelOptions', 'wheelPalette', 'dreams']

export default function App() {
  const [tab, setTab] = useState('timer')
  const [state, setState] = useState(loadState)
  // null = проверяем статус связки, false = не связаны, true = связаны
  const [paired, setPaired] = useState(null)
  const [partnerName, setPartnerName] = useState(null)
  const pushTimer = useRef(null)
  const inTg = isInTelegram()

  useEffect(() => { saveState(state) }, [state])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    window.Telegram?.WebApp?.setHeaderColor?.(state.theme === 'dark' ? '#1c1c1e' : '#ffffff')
  }, [state.theme])

  const applyServerPair = useCallback((pair) => {
    setPartnerName(pair.partnerName)
    setState((s) => ({
      ...s,
      startDate: pair.startDate,
      eventName: pair.eventName,
      wheelOptions: pair.wheelOptions,
      wheelPalette: pair.wheelPalette,
      dreams: pair.dreams,
    }))
  }, [])

  // При старте внутри Telegram — проверяем, связаны ли уже
  useEffect(() => {
    if (!inTg) { setPaired(false); return }
    let cancelled = false
    api.getState()
      .then((res) => {
        if (cancelled) return
        if (res.paired) { applyServerPair(res.pair); setPaired(true) }
        else setPaired(false)
      })
      .catch(() => !cancelled && setPaired(false))
    return () => { cancelled = true }
  }, [inTg, applyServerPair])

  // Пока связаны — периодически подтягиваем изменения партнёра
  useEffect(() => {
    if (!inTg || !paired) return
    const id = setInterval(() => {
      api.getState().then((res) => res.paired && applyServerPair(res.pair)).catch(() => {})
    }, 7000)
    return () => clearInterval(id)
  }, [inTg, paired, applyServerPair])

  // Обновление состояния: локально всегда, на сервер — только синхронизируемые поля, с debounce
  const update = useCallback((patch) => {
    setState((s) => ({ ...s, ...patch }))
    if (!inTg || !paired) return
    const toSync = Object.fromEntries(
      Object.entries(patch).filter(([k]) => SYNCED_KEYS.includes(k))
    )
    if (Object.keys(toSync).length === 0) return
    clearTimeout(pushTimer.current)
    pushTimer.current = setTimeout(() => api.putState(toSync).catch(() => {}), 600)
  }, [inTg, paired])

  if (paired === null) {
    return (
      <div className="app">
        <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'var(--text-2)', fontSize: 14 }}>Загрузка…</span>
        </div>
      </div>
    )
  }

  if (inTg && !paired) {
    return (
      <div className="app">
        <PairingScreen onPaired={(pair) => { applyServerPair(pair); setPaired(true) }} />
      </div>
    )
  }

  const screens = {
    timer: <TimerScreen state={state} update={update} partnerName={partnerName} />,
    spin: <SpinScreen state={state} update={update} />,
    ideas: <IdeasScreen state={state} update={update} />,
    date: <DateScreen inTg={inTg} paired={paired} partnerName={partnerName} />,
  }

  return (
    <div className="app">
      <div className="screen" key={tab}>
        {screens[tab]}
      </div>
      <nav className="tabbar">
        {TABS.map(({ id, Icon }) => (
          <button
            key={id}
            className={`tab ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon />
          </button>
        ))}
      </nav>
    </div>
  )
}
