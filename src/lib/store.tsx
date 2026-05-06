'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, Task, TeamMember } from './types';
import { initialTasks, initialMembers } from './data';

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? { ...t, status: action.payload.status, updatedAt: new Date().toISOString() }
            : t
        ),
      };
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] };
    case 'DELETE_MEMBER':
      return { ...state, members: state.members.filter(m => m.id !== action.payload) };
    default:
      return state;
  }
}

const STORAGE_KEY = 'team-tasks-state';

function loadState(): AppState {
  if (typeof window === 'undefined') return { tasks: initialTasks, members: initialMembers };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { tasks: initialTasks, members: initialMembers };
}

interface ContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const StoreContext = createContext<ContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10);
}
