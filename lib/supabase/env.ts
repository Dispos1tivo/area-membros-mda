export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    'Faltam as variáveis do Supabase. Copie .env.example para .env.local e preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
  )
}
