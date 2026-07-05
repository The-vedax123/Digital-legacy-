import { buildSeed } from './seed'

/**
 * Local persistence layer for EchoVault demo mode.
 * Data is namespaced per-user in localStorage. When Supabase credentials are
 * configured, auth is handled by Supabase; vault data still persists locally
 * for a zero-config, fully working demo. The shape mirrors the Supabase schema
 * in supabase/schema.sql so it can be swapped for real tables later.
 */

const KEY = (uid) => `echovault:data:${uid}`
const USERS_KEY = 'echovault:users'
const SESSION_KEY = 'echovault:session'

const read = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v))

export const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`)

/* ------------------------- Local auth (demo mode) ------------------------- */

export const localAuth = {
  getSession() {
    return read(SESSION_KEY, null)
  },
  listUsers() {
    return read(USERS_KEY, [])
  },
  signUp(email, password, name) {
    const users = read(USERS_KEY, [])
    if (users.find((u) => u.email === email)) throw new Error('An account with this email already exists.')
    const user = { id: uid(), email, password, name: name || email.split('@')[0], createdAt: new Date().toISOString() }
    users.push(user)
    write(USERS_KEY, users)
    ensureData(user.id, true)
    const session = { id: user.id, email: user.email, name: user.name }
    write(SESSION_KEY, session)
    return session
  },
  signIn(email, password) {
    const users = read(USERS_KEY, [])
    const user = users.find((u) => u.email === email)
    // Demo mode has no shared backend — accounts live in this browser only.
    // If the email isn't found here (e.g. you signed up on a different Vercel
    // URL/device), provision it on the spot so the hosted demo never dead-ends.
    if (!user) return this.signUp(email, password, email.split('@')[0])
    if (user.password !== password) throw new Error('Incorrect password for this account.')
    const session = { id: user.id, email: user.email, name: user.name }
    write(SESSION_KEY, session)
    return session
  },
  signInDemo() {
    const email = 'demo@echovault.app'
    const users = read(USERS_KEY, [])
    let user = users.find((u) => u.email === email)
    if (!user) {
      user = { id: 'demo-user', email, password: 'demo', name: 'Alex Okafor', createdAt: new Date().toISOString() }
      users.push(user)
      write(USERS_KEY, users)
      ensureData(user.id, true)
    }
    const session = { id: user.id, email: user.email, name: user.name }
    write(SESSION_KEY, session)
    return session
  },
  signOut() {
    localStorage.removeItem(SESSION_KEY)
  },
  updateProfile(id, patch) {
    const users = read(USERS_KEY, [])
    const i = users.findIndex((u) => u.id === id)
    if (i >= 0) {
      users[i] = { ...users[i], ...patch }
      write(USERS_KEY, users)
    }
    const s = read(SESSION_KEY, null)
    if (s && s.id === id) write(SESSION_KEY, { ...s, ...patch })
  },
}

/* ------------------------------ Vault data ------------------------------- */

const empty = () => ({
  documents: [],
  memories: [],
  contacts: [],
  capsules: [],
  emergency: {
    bloodGroup: '',
    conditions: '',
    allergies: '',
    medication: '',
    doctor: '',
    insurance: '',
    emergencyContacts: '',
  },
  activity: [],
})

function ensureData(userId, seed = false) {
  const existing = read(KEY(userId), null)
  if (existing) return existing
  const data = seed ? buildSeed() : empty()
  write(KEY(userId), data)
  return data
}

export const vaultStore = {
  load(userId) {
    return ensureData(userId, false)
  },
  save(userId, data) {
    write(KEY(userId), data)
    return data
  },
  reset(userId) {
    write(KEY(userId), empty())
    return empty()
  },
  reseed(userId) {
    const data = buildSeed()
    write(KEY(userId), data)
    return data
  },
}
