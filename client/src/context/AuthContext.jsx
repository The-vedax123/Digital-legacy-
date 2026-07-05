import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseEnabled } from '../lib/supabase'
import { localAuth } from '../lib/store'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let sub
    async function init() {
      if (isSupabaseEnabled) {
        const { data } = await supabase.auth.getSession()
        setUser(mapSupabaseUser(data?.session?.user))
        const listener = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(mapSupabaseUser(session?.user))
        })
        sub = listener.data.subscription
      } else {
        setUser(localAuth.getSession())
      }
      setLoading(false)
    }
    init()
    return () => sub?.unsubscribe?.()
  }, [])

  const value = {
    user,
    loading,
    isSupabaseEnabled,

    async signUp(email, password, name) {
      if (isSupabaseEnabled) {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
        if (error) throw error
        const u = mapSupabaseUser(data.user)
        if (u) setUser(u)
        return u
      }
      const s = localAuth.signUp(email, password, name)
      setUser(s)
      return s
    },

    async signIn(email, password) {
      if (isSupabaseEnabled) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        const u = mapSupabaseUser(data.user)
        setUser(u)
        return u
      }
      const s = localAuth.signIn(email, password)
      setUser(s)
      return s
    },

    async signInWithGoogle() {
      if (isSupabaseEnabled) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/app` },
        })
        if (error) throw error
        return
      }
      // Demo mode: simulate Google sign-in
      const s = localAuth.signInDemo()
      setUser(s)
      return s
    },

    async signInDemo() {
      if (isSupabaseEnabled) {
        // Best-effort demo login when Supabase is on
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email: 'demo@echovault.app', password: 'demo-echovault' })
          if (error) throw error
          setUser(mapSupabaseUser(data.user))
          return
        } catch {
          /* fall through */
        }
      }
      const s = localAuth.signInDemo()
      setUser(s)
      return s
    },

    async resetPassword(email) {
      if (isSupabaseEnabled) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset` })
        if (error) throw error
        return
      }
      // Demo mode: pretend to send an email
      await new Promise((r) => setTimeout(r, 600))
    },

    async signOut() {
      if (isSupabaseEnabled) await supabase.auth.signOut()
      else localAuth.signOut()
      setUser(null)
    },

    updateProfile(patch) {
      if (!user) return
      if (!isSupabaseEnabled) localAuth.updateProfile(user.id, patch)
      setUser((u) => ({ ...u, ...patch }))
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function mapSupabaseUser(u) {
  if (!u) return null
  return {
    id: u.id,
    email: u.email,
    name: u.user_metadata?.name || u.email?.split('@')[0] || 'Member',
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
