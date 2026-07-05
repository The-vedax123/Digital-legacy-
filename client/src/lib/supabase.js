import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Supabase client. Only created when both env vars are present.
 * When absent, EchoVault runs in local demo mode (localStorage) so the
 * product is fully functional out-of-the-box for the hackathon demo.
 */
export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseEnabled = Boolean(supabase)
