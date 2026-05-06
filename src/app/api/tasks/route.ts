import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const mine = request.nextUrl.searchParams.get('mine') === 'true'
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: true })
  if (mine) query = query.eq('assignee_id', user.id)

  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, assignee_id } = body
  if (!title) return Response.json({ error: 'title is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, assignee_id: assignee_id ?? user.id, created_by: user.id })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}
