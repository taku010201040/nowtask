export type TaskColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'gray';

export type TaskStatus = '未着手' | '進行中' | '完了';

export interface Task {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  status: TaskStatus;
  color: TaskColor;
  memo?: string;
  tag?: string;
  priority?: 1 | 2 | 3; // 1=高, 2=中, 3=低
}

export interface TaskFormData {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  status: TaskStatus;
  color: TaskColor;
  memo: string;
  tag: string;
  priority: 1 | 2 | 3;
}
