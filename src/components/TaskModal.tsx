'use client';

import { useState, useEffect } from 'react';
import { Task, Priority, Status } from '@/lib/types';
import { useStore, generateId } from '@/lib/store';
import { PRIORITY_LABEL, STATUS_LABEL } from '@/lib/utils';

interface Props {
  task?: Task | null;
  defaultStatus?: Status;
  onClose: () => void;
}

const EMPTY: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assigneeId: null,
  dueDate: null,
  tags: [],
};

export default function TaskModal({ task, defaultStatus, onClose }: Props) {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState({ ...EMPTY });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate,
        tags: task.tags,
      });
    } else if (defaultStatus) {
      setForm(f => ({ ...f, status: defaultStatus }));
    }
  }, [task, defaultStatus]);

  function set<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      set('tags', [...form.tags, t]);
    }
    setTagInput('');
  }

  function removeTag(tag: string) {
    set('tags', form.tags.filter(t => t !== tag));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setErrors({ title: '제목을 입력하세요.' });
      return;
    }
    const now = new Date().toISOString();
    if (task) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...task, ...form, updatedAt: now } });
    } else {
      dispatch({
        type: 'ADD_TASK',
        payload: { ...form, id: generateId(), createdAt: now, updatedAt: now },
      });
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-slate-800">
            {task ? '일감 수정' : '새 일감 추가'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">제목 *</label>
            <input
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 ${errors.title ? 'border-red-400' : 'border-slate-300'}`}
              value={form.title}
              onChange={e => { set('title', e.target.value); setErrors({}); }}
              placeholder="일감 제목을 입력하세요"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">설명</label>
            <textarea
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="상세 내용을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">상태</label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.status}
                onChange={e => set('status', e.target.value as Status)}
              >
                {(Object.keys(STATUS_LABEL) as Status[]).map(s => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">우선순위</label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.priority}
                onChange={e => set('priority', e.target.value as Priority)}
              >
                {(Object.keys(PRIORITY_LABEL) as Priority[]).map(p => (
                  <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">담당자</label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.assigneeId ?? ''}
                onChange={e => set('assigneeId', e.target.value || null)}
              >
                <option value="">미배정</option>
                {state.members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">마감일</label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                value={form.dueDate ?? ''}
                onChange={e => set('dueDate', e.target.value || null)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">태그</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="태그 입력 후 Enter"
              />
              <button type="button" onClick={addTag} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700">추가</button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
            >
              {task ? '저장' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
