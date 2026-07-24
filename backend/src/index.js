import 'dotenv/config'
import { createBot } from './bot.js'
import { createServer } from './server.js'

const token = process.env.BOT_TOKEN
if (!token) throw new Error('BOT_TOKEN не задан в backend/.env')

const botUsername = process.env.BOT_USERNAME
const appUrl = process.env.MINI_APP_URL || null

const bot = createBot(token, appUrl)
const app = createServer({ botToken: token, botUsername, bot })

const port = process.env.PORT || 8787
app.listen(port, () => {
  console.log(`API запущен на http://localhost:${port}`)
  console.log(`Бот @${botUsername} слушает через polling`)
})
