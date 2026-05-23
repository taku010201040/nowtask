import type { TaskColor } from '../types';

export const COLOR_MAP: Record<TaskColor, { hex: string; label: string; cssVar: string }> = {
  red:    { hex: '#EF4444', label: 'レッド',   cssVar: '--color-red' },
  orange: { hex: '#F97316', label: 'オレンジ', cssVar: '--color-orange' },
  yellow: { hex: '#EAB308', label: 'イエロー', cssVar: '--color-yellow' },
  green:  { hex: '#22C55E', label: 'グリーン', cssVar: '--color-green' },
  blue:   { hex: '#3B82F6', label: 'ブルー',   cssVar: '--color-blue' },
  purple: { hex: '#A855F7', label: 'パープル', cssVar: '--color-purple' },
  gray:   { hex: '#9CA3AF', label: 'グレー',   cssVar: '--color-gray' },
};

export const COLOR_KEYS = Object.keys(COLOR_MAP) as TaskColor[];

export const STORAGE_KEY = 'nowtask_tasks';

export const HOUR_MARKS = [0, 3, 6, 9, 12, 15, 18, 21];

// 時計の角度計算（0時 = 最上部、時計回り）
export const timeToAngle = (hour: number, minute: number = 0): number => {
  return ((hour + minute / 60) / 24) * 360;
};

// "HH:mm" → 分に変換
export const timeStringToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// 分 → "HH:mm"
export const minutesToTimeString = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// UUID生成
export const generateId = (): string =>
  crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

// 今日の日付 YYYY-MM-DD
export const todayStr = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// 残り時間テキスト
export const formatRemaining = (endTimeStr: string): string => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const endMinutes = timeStringToMinutes(endTimeStr);
  const diff = endMinutes - currentMinutes;
  if (diff <= 0) return '終了';
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h > 0) return `残り${h}時間${m > 0 ? m + '分' : ''}`;
  return `残り${m}分`;
};
