import TelegramBot from 'node-telegram-bot-api'
import { createPair, joinPair, getPairByUser, getPartner } from './db.js'

export function createBot(token, appUrl) {
  const bot = new TelegramBot(token, { polling: true })

  const openAppKeyboard = appUrl
    ? { reply_markup: { inline_keyboard: [[{ text: 'Открыть приложение', web_app: { url: appUrl } }]] } }
    : undefined

  bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
    const userId = String(msg.from.id)
    const name = msg.from.first_name || 'Партнёр'
    const payload = match[1]

    // Переход по ссылке-приглашению: /start pair_XXXXXXXX
    if (payload && payload.startsWith('pair_')) {
      const code = payload.replace('pair_', '')
      const pair = await joinPair(code, userId, name)

      if (!pair) {
        await bot.sendMessage(msg.chat.id, 'Ссылка недействительна, уже использована или это твоя же ссылка 🙂')
        return
      }

      const partner = getPartner(pair, userId)
      await bot.sendMessage(msg.chat.id, `Готово! Вы связаны с ${partner.name} 💕`, openAppKeyboard)
      await bot.sendMessage(partner.id, `❤️ ${name} подключилась к вашей паре! Теперь всё общее.`, openAppKeyboard).catch(() => {})
      return
    }

    const existing = await getPairByUser(userId)
    if (existing) {
      await bot.sendMessage(msg.chat.id, 'С возвращением 👋 Открой приложение:', openAppKeyboard)
      return
    }

    await bot.sendMessage(
      msg.chat.id,
      'Привет! Это приложение для вас двоих 💕\n\nОткрой его и создай приглашение — партнёр перейдёт по ссылке, и всё станет общим: таймер, мечты, колесо.',
      openAppKeyboard
    )
  })

  // Ответ на приглашение на свидание
  bot.on('callback_query', async (query) => {
    const data = query.data
    if (data !== 'date_yes' && data !== 'date_no') return

    const userId = String(query.from.id)
    const pair = await getPairByUser(userId)
    const partner = pair ? getPartner(pair, userId) : null

    if (partner) {
      const text = data === 'date_yes'
        ? `❤️ ${query.from.first_name} согласна на свидание! Ура!`
        : `😔 ${query.from.first_name} пока не может. Может, предложишь другое время?`
      await bot.sendMessage(partner.id, text).catch(() => {})
    }

    await bot.answerCallbackQuery(query.id, { text: 'Ответ отправлен ❤️' }).catch(() => {})
  })

  return bot
}
