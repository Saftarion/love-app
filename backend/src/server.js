import express from 'express'
import cors from 'cors'
import { validateInitData } from './initData.js'
import { createPair, getPairByUser, updatePairState, getPartner } from './db.js'

export function createServer({ botToken, botUsername, bot }) {
  const app = express()
  app.use(cors())
  app.use(express.json())

  function auth(req, res, next) {
    const initData = req.body?.initData || req.query?.initData
    const result = validateInitData(initData, botToken)
    if (!result) return res.status(401).json({ error: 'invalid initData' })
    req.tgUser = result.user
    next()
  }

  function publicPair(pair, forUserId) {
    const partner = getPartner(pair, forUserId)
    const { id, status, startDate, eventName, wheelOptions, wheelPalette, dreams } = pair
    return { id, status, startDate, eventName, wheelOptions, wheelPalette, dreams, partnerName: partner?.name || null }
  }

  app.get('/health', (req, res) => res.json({ ok: true }))

  // Получить/создать ссылку-приглашение
  app.post('/api/invite/create', auth, async (req, res) => {
    const userId = String(req.tgUser.id)
    const name = req.tgUser.first_name || 'Я'
    let pair = await getPairByUser(userId)
    if (!pair) pair = await createPair(userId, name)

    res.json({
      inviteLink: `https://t.me/${botUsername}?start=pair_${pair.inviteCode}`,
      status: pair.status,
      pair: publicPair(pair, userId),
    })
  })

  // Текущее состояние (для синхронизации при открытии / поллинге)
  app.get('/api/state', auth, async (req, res) => {
    const userId = String(req.tgUser.id)
    const pair = await getPairByUser(userId)
    if (!pair) return res.json({ paired: false })
    res.json({ paired: pair.status === 'paired', pair: publicPair(pair, userId) })
  })

  // Частичное обновление состояния пары (таймер, колесо, мечты)
  app.put('/api/state', auth, async (req, res) => {
    const userId = String(req.tgUser.id)
    const pair = await getPairByUser(userId)
    if (!pair) return res.status(404).json({ error: 'no pair' })

    const before = pair.dreams?.length || 0
    const updated = await updatePairState(pair.id, req.body.patch || {})

    // если появилась новая мечта — уведомляем партнёра
    if (updated.dreams?.length > before) {
      const partner = getPartner(updated, userId)
      const added = updated.dreams[updated.dreams.length - 1]
      if (partner && added) {
        bot.sendMessage(partner.id, `💡 ${req.tgUser.first_name} добавил(а) новую мечту: «${added.text}»`).catch(() => {})
      }
    }

    res.json({ pair: publicPair(updated, userId) })
  })

  // Пригласить партнёра на свидание — пуш прямо в Telegram
  app.post('/api/invite/date', auth, async (req, res) => {
    const userId = String(req.tgUser.id)
    const pair = await getPairByUser(userId)
    if (!pair || pair.status !== 'paired') return res.status(400).json({ error: 'not paired' })

    const partner = getPartner(pair, userId)
    if (!partner) return res.status(400).json({ error: 'no partner' })

    const { when, place, message } = req.body
    const text = [
      `💌 ${req.tgUser.first_name} зовёт тебя на свидание!`,
      '',
      `🗓 ${when || 'скоро'}`,
      place ? `📍 ${place}` : null,
      message ? `\n«${message}»` : null,
    ].filter(Boolean).join('\n')

    try {
      await bot.sendMessage(partner.id, text, {
        reply_markup: {
          inline_keyboard: [[
            { text: '❤️ Да, конечно!', callback_data: 'date_yes' },
            { text: 'Не могу 😔', callback_data: 'date_no' },
          ]],
        },
      })
    } catch (err) {
      return res.status(502).json({ error: 'partner unreachable', detail: err.message })
    }

    res.json({ ok: true })
  })

  return app
}
