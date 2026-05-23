import type { Task } from '../types';
import { generateId, todayStr } from '../utils/constants';

const today = todayStr();
const [year, month, day] = today.split('-');

// 昨日と明日
const yesterday = `${year}-${month}-${String(Number(day) - 1).padStart(2, '0')}`;
const tomorrow = `${year}-${month}-${String(Number(day) + 1).padStart(2, '0')}`;

export const SAMPLE_TASKS: Task[] = [
  {
    id: generateId(),
    name: 'ディープワークセッション',
    date: today,
    startTime: '09:00',
    endTime: '12:00',
    status: '完了',
    color: 'blue',
    tag: 'Work',
    priority: 1,
    memo: 'プロダクト設計に集中する',
  },
  {
    id: generateId(),
    name: 'ランチ・休憩',
    date: today,
    startTime: '12:00',
    endTime: '13:00',
    status: '完了',
    color: 'green',
    tag: 'Personal',
    priority: 3,
  },
  {
    id: generateId(),
    name: 'ハッカソン開発',
    date: today,
    startTime: '13:00',
    endTime: '18:00',
    status: '進行中',
    color: 'orange',
    tag: 'Work',
    priority: 1,
    memo: 'NowTaskのUI実装',
  },
  {
    id: generateId(),
    name: 'ジムでのトレーニング',
    date: today,
    startTime: '18:30',
    endTime: '19:30',
    status: '未着手',
    color: 'red',
    tag: 'Health',
    priority: 2,
  },
  {
    id: generateId(),
    name: '読書とリラックス',
    date: today,
    startTime: '20:00',
    endTime: '22:00',
    status: '未着手',
    color: 'purple',
    tag: 'Rest',
    priority: 3,
    memo: '技術書を読む',
  },
  {
    id: generateId(),
    name: '睡眠',
    date: today,
    startTime: '23:00',
    endTime: '07:00',
    status: '未着手',
    color: 'gray',
    tag: 'Rest',
    priority: 3,
  },
  {
    id: generateId(),
    name: '朝の準備・散歩',
    date: yesterday,
    startTime: '07:00',
    endTime: '09:00',
    status: '完了',
    color: 'yellow',
    tag: 'Personal',
    priority: 2,
  },
  {
    id: generateId(),
    name: '企画資料作成',
    date: tomorrow,
    startTime: '10:00',
    endTime: '12:00',
    status: '未着手',
    color: 'blue',
    tag: 'Work',
    priority: 1,
  },
];
