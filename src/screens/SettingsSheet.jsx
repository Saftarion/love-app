import { CalendarIcon, SunIcon, MoonIcon, LinkIcon } from '../components/Icons'
import './SettingsSheet.css'

export default function SettingsSheet({ state, update, onClose, partnerName }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber" />
        <h2 className="sheet-title">Настройки</h2>

        <div className="set-label">Таймер</div>
        <div className="glass set-group">
          <div className="set-row">
            <div className="set-ic"><CalendarIcon /></div>
            <div className="set-txt">Дата начала</div>
            <input
              type="date"
              className="set-input"
              value={state.startDate}
              onChange={(e) => update({ startDate: e.target.value })}
            />
          </div>
          <div className="set-row">
            <div className="set-ic"><span className="tico">T</span></div>
            <div className="set-txt">Название</div>
            <input
              type="text"
              className="set-input"
              value={state.eventName}
              maxLength={20}
              onChange={(e) => update({ eventName: e.target.value })}
            />
          </div>
        </div>

        <div className="set-label">Оформление</div>
        <div className="glass set-group">
          <div className="set-row">
            <div className="set-ic">{state.theme === 'dark' ? <MoonIcon /> : <SunIcon />}</div>
            <div className="set-txt">Тема</div>
            <div className="seg">
              <button
                className={`seg-o ${state.theme === 'light' ? 'on' : ''}`}
                onClick={() => update({ theme: 'light' })}
              ><SunIcon /> Светлая</button>
              <button
                className={`seg-o ${state.theme === 'dark' ? 'on' : ''}`}
                onClick={() => update({ theme: 'dark' })}
              ><MoonIcon /> Тёмная</button>
            </div>
          </div>
        </div>

        <div className="set-label">Пара</div>
        <div className="glass set-group">
          <div className="set-row">
            <div className="set-ic"><LinkIcon /></div>
            <div className="set-txt">Связь с партнёром</div>
            <div className="set-val">{partnerName ? `Соединено · ${partnerName}` : 'Не подключено'}</div>
          </div>
        </div>

        <button className="btn set-done" onClick={onClose}>Готово</button>
      </div>
    </div>
  )
}
