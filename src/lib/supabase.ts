import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export const logActivity = async (action: string, entity: string, details: any) => {
  // Database logging disabled for now
  console.log(`[Activity Log Bypass] ${action} on ${entity}`, details);
}
