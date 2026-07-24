import crypto from 'crypto'

// Проверка подписи initData от Telegram WebApp.
// Алгоритм: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
export function validateInitData(initData, botToken) {
  if (!initData) return null

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null
  params.delete('hash')

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()
  const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  if (computedHash !== hash) return null

  const userRaw = params.get('user')
  const user = userRaw ? JSON.parse(userRaw) : null
  if (!user?.id) return null

  return { user }
}
