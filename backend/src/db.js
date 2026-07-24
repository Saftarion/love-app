import { JSONFilePreset } from 'lowdb/node'
import crypto from 'crypto'

const defaultData = { pairs: {}, userIndex: {} }
const db = await JSONFilePreset('data/db.json', defaultData)

function genCode() {
  return crypto.randomBytes(4).toString('hex')
}

export async function createPair(userId, name) {
  const id = 'p_' + crypto.randomBytes(6).toString('hex')
  const pair = {
    id,
    inviteCode: genCode(),
    status: 'pending',
    users: { a: { id: String(userId), name }, b: null },
    startDate: new Date().toISOString().slice(0, 10),
    eventName: 'Вместе',
    wheelOptions: ['Пикник', 'Кино дома', 'Готовим вместе', 'Прогулка'],
    wheelPalette: 'sunset',
    dreams: [],
    createdAt: Date.now(),
  }
  db.data.pairs[id] = pair
  db.data.userIndex[String(userId)] = id
  await db.write()
  return pair
}

export async function joinPair(code, userId, name) {
  const pair = Object.values(db.data.pairs).find(
    (p) => p.inviteCode === code && p.status === 'pending'
  )
  if (!pair) return null
  if (String(pair.users.a.id) === String(userId)) return null // нельзя связаться с собой

  pair.users.b = { id: String(userId), name }
  pair.status = 'paired'
  db.data.userIndex[String(userId)] = pair.id
  await db.write()
  return pair
}

export async function getPairByUser(userId) {
  const pairId = db.data.userIndex[String(userId)]
  if (!pairId) return null
  return db.data.pairs[pairId] || null
}

export async function updatePairState(pairId, patch) {
  const pair = db.data.pairs[pairId]
  if (!pair) return null
  const allowed = ['startDate', 'eventName', 'wheelOptions', 'wheelPalette', 'dreams']
  for (const key of allowed) {
    if (patch[key] !== undefined) pair[key] = patch[key]
  }
  await db.write()
  return pair
}

export function getPartner(pair, userId) {
  if (!pair.users.a || !pair.users.b) return null
  if (String(pair.users.a.id) === String(userId)) return pair.users.b
  if (String(pair.users.b.id) === String(userId)) return pair.users.a
  return null
}

export { db }
