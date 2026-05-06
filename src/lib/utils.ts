import { Priority, Status } from './types';

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  urgent: '긴급',
};

export const STATUS_LABEL: Record<Status, string> = {
  todo: '할 일',
  in_progress: '진행 중',
  review: '검토',
  done: '완료',
};

export const PRIORITY_COLOR: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export const STATUS_COLOR: Record<Status, string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-700',
  review: 'bg-purple-100 text-purple-700',
  done: 'bg-green-100 text-green-700',
};

export const STATUS_BG: Record<Status, string> = {
  todo: 'bg-slate-50 border-slate-200',
  in_progress: 'bg-blue-50 border-blue-200',
  review: 'bg-purple-50 border-purple-200',
  done: 'bg-green-50 border-green-200',
};

export function getInitials(name: string) {
  return name.slice(0, 2);
}

export function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function isOverdue(dateStr: string | null, status: Status) {
  if (!dateStr || status === 'done') return false;
  return new Date(dateStr) < new Date();
}
