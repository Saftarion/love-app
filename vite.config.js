import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' — чтобы работало на любом хостинге (Telegram открывает по любому URL)
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 3000, host: true }
})
