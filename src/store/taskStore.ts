import type { Task, TaskStatus } from '../types';
import { STORAGE_KEY, todayStr, timeStringToMinutes } from '../utils/constants';
import { SAMPLE_TASKS } from '../data/sampleTasks';

// LocalStorage から全タスクを取得（初回はサンプルデータを投入）
export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Task[];
    }
    // 初回：サンプルデータを保存
    saveTasks(SAMPLE_TASKS);
    return SAMPLE_TASKS;
  } catch {
    return SAMPLE_TASKS;
  }
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = (tasks: Task[], task: Task): Task[] => {
  const next = [...tasks, task];
  saveTasks(next);
  return next;
};

export const updateTaskStatus = (tasks: Task[], id: string, status: TaskStatus): Task[] => {
  const next = tasks.map((t) => (t.id === id ? { ...t, status } : t));
  saveTasks(next);
  return next;
};

export const deleteTask = (tasks: Task[], id: string): Task[] => {
  const next = tasks.filter((t) => t.id !== id);
  saveTasks(next);
  return next;
};

// 今日のタスクを時刻順に取得
export const getTodayTasks = (tasks: Task[]): Task[] => {
  const today = todayStr();
  return tasks
    .filter((t) => t.date === today && t.status !== '完了')
    .sort((a, b) => {
      const aStart = a.startTime ? timeStringToMinutes(a.startTime) : 0;
      const bStart = b.startTime ? timeStringToMinutes(b.startTime) : 0;
      return aStart - bStart;
    });
};

// 「今のタスク」判定
export const getCurrentTask = (tasks: Task[]): Task | null => {
  const today = todayStr();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayTasks = tasks.filter((t) => t.date === today && t.status !== '完了');

  // 1. 進行中 かつ 現在時刻が範囲内
  const inProgress = todayTasks.find((t) => {
    if (t.status !== '進行中') return false;
    if (!t.startTime || !t.endTime) return true;
    const start = timeStringToMinutes(t.startTime);
    const end = timeStringToMinutes(t.endTime);
    return currentMinutes >= start && currentMinutes < end;
  });
  if (inProgress) return inProgress;

  // 2. 開始時刻が最も近い未着手タスク（現在以降）
  const upcoming = todayTasks
    .filter((t) => t.status === '未着手' && t.startTime)
    .filter((t) => timeStringToMinutes(t.startTime!) >= currentMinutes)
    .sort((a, b) => timeStringToMinutes(a.startTime!) - timeStringToMinutes(b.startTime!));
  if (upcoming.length > 0) return upcoming[0];

  // 3. 現在を含む範囲の未着手タスク
  const active = todayTasks.find((t) => {
    if (!t.startTime || !t.endTime) return false;
    const start = timeStringToMinutes(t.startTime);
    const end = timeStringToMinutes(t.endTime);
    return currentMinutes >= start && currentMinutes < end;
  });
  if (active) return active;

  return null;
};
