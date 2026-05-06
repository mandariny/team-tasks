export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in_progress' | 'review' | 'done';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface AppState {
  tasks: Task[];
  members: TeamMember[];
}

export type AppAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { id: string; status: Status } }
  | { type: 'ADD_MEMBER'; payload: TeamMember }
  | { type: 'DELETE_MEMBER'; payload: string };
