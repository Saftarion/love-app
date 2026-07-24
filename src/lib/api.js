// Клиент для backend API. Работает только внутри Telegram (нужен initData для подписи запросов).
// Если задать VITE_API_URL при сборке — используется он, иначе локальный дев-бэкенд.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

function getInitData() {
  return window.Telegram?.WebApp?.initData || ''
}

export function isInTelegram() {
  return !!getInitData()
}

async function request(path, { method = 'GET', body } = {}) {
  const initData = getInitData()
  const opts = { method, headers: { 'Content-Type': 'application/json' } }

  if (method === 'GET') {
    const url = `${API_BASE}${path}?initData=${encodeURIComponent(initData)}`
    const res = await fetch(url)
    return res.json()
  }

  opts.body = JSON.stringify({ initData, ...body })
  const res = await fetch(`${API_BASE}${path}`, opts)
  return { status: res.status, ...(await res.json()) }
}

export const api = {
  createInvite: () => request('/api/invite/create', { method: 'POST' }),
  getState: () => request('/api/state'),
  putState: (patch) => request('/api/state', { method: 'PUT', body: { patch } }),
  sendDateInvite: (payload) => request('/api/invite/date', { method: 'POST', body: payload }),
}
