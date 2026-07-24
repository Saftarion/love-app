import { useState, useEffect } from 'react'
import { loadState, saveState } from './lib/storage'
import TimerScreen from './screens/TimerScreen'
import SpinScreen from './screens/SpinScreen'
import IdeasScreen from './screens/IdeasScreen'
import DateScreen from './screens/DateScreen'
import { HomeIcon, WheelIcon, LightbulbIcon, HeartIcon } from './components/Icons'

const TABS = [
  { id: 'timer', Icon: HomeIcon },
  { id: 'spin', Icon: WheelIcon },
  { id: 'ideas', Icon: LightbulbIcon },
  { id: 'date', Icon: HeartIcon },
]

export default function App() {
  const [tab, setTab] = useState('timer')
  const [state, setState] = useState(loadState)

  // Сохраняем в localStorage при любом изменении
  useEffect(() => { saveState(state) }, [state])

  // Применяем тему на <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    const tg = window.Telegram?.WebApp
    if (tg) tg.setHeaderColor?.(state.theme === 'dark' ? '#1c1c1e' : '#ffffff')
  }, [state.theme])

  // Хелпер для частичного обновления состояния
  const update = (patch) => setState((s) => ({ ...s, ...patch }))

  const screens = {
    timer: <TimerScreen state={state} update={update} />,
    spin: <SpinScreen state={state} update={update} />,
    ideas: <IdeasScreen state={state} update={update} />,
    date: <DateScreen state={state} />,
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
