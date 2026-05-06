'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  async function signInWithGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="flex flex-1 items-center justify-center">
      <button
        onClick={signInWithGoogle}
        className="rounded-lg border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
      >
        Google로 로그인
      </button>
    </main>
  )
}
