// Локальное хранилище (пока без бэкенда). Позже заменим на API + синхронизацию пары.
const KEY = 'love-app-state'

const defaults = {
  startDate: '2024-09-12',
  eventName: 'Вместе',
  theme: 'dark',
  wheelPalette: 'sunset',
  wheelOptions: ['Пикник', 'Кино дома', 'Готовим вместе', 'Прогулка'],
  dreams: [
    { id: 1, text: 'Пикник в парке', done: false },
    { id: 2, text: 'Смотреть фильм', done: true },
    { id: 3, text: 'Побег в горы', done: false },
    { id: 4, text: 'Ужин в ресторане', done: false }
  ]
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...defaults }
    return { ...defaults, ...JSON.parse(raw) }
  } catch {
    return { ...defaults }
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}
