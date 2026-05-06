'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/database.types'

type Task = Tables<'tasks'>

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email ?? null)
    })
  }, [])

  async function signOut() {
    await createClient().auth.signOut()
    router.push('/login')
  }

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/tasks')
    if (res.status === 401) {
      setAuthed(false)
      setLoading(false)
      return
    }
    if (!res.ok) {
      setError('목록을 불러오지 못했습니다.')
      setLoading(false)
      return
    }
    setTasks(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAdding(true)
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim() }),
    })
    if (res.ok) setNewTitle('')
    setAdding(false)
    fetchTasks()
  }

  async function toggleTask(task: Task) {
    const next = task.status === 'todo' ? 'done' : 'todo'
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    if (res.status === 403) {
      setError('본인 일감의 상태만 변경할 수 있습니다.')
      return
    }
    if (!res.ok) {
      setError('상태 변경에 실패했습니다.')
      return
    }
    setError(null)
    fetchTasks()
  }

  async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) {
      setError('삭제에 실패했습니다.')
      return
    }
    setError(null)
    fetchTasks()
  }

  if (!authed) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-500">
          로그인이 필요합니다.{' '}
          <a href="/api/auth/login" className="font-medium text-zinc-900 underline underline-offset-2">
            로그인
          </a>
        </p>
      </div>
    )
  }

  return (
    <main className="max-w-xl mx-auto w-full px-4 py-12 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">일감 목록</h1>
        {email && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500">{email}</span>
            <button
              onClick={signOut}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>

      <form onSubmit={addTask} className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
          placeholder="새 일감 제목"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={adding}
        />
        <button
          type="submit"
          disabled={adding || !newTitle.trim()}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          추가
        </button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-zinc-400">불러오는 중…</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-zinc-400">등록된 일감이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center gap-3 rounded-lg border border-zinc-100 px-4 py-3">
              <span
                className={`flex-1 text-sm ${
                  task.status === 'done' ? 'text-zinc-400 line-through' : 'text-zinc-900'
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => toggleTask(task)}
                className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium hover:bg-zinc-50"
              >
                {task.status === 'todo' ? '완료' : '되돌리기'}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="rounded-full border border-red-100 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
