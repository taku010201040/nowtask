import React from 'react';
import type { Task } from '../../types';
import { COLOR_MAP } from '../../utils/constants';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  currentTaskId?: string;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onStatusChange,
  onDelete,
  currentTaskId,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="task-list task-list--empty">
        <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-on-surface-variant)', opacity: 0.4 }}>
          event_available
        </span>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          今日のタスクはありません
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isActive={task.id === currentTaskId}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

/* ---- Task Card ---- */
interface TaskCardProps {
  task: Task;
  isActive: boolean;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isActive, onStatusChange, onDelete }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const color = COLOR_MAP[task.color]?.hex ?? '#9CA3AF';
  const isDone = task.status === '完了';

  const handleComplete = () => {
    onStatusChange(task.id, isDone ? '未着手' : '完了');
  };

  return (
    <div
      className={`task-card ${isActive ? 'task-card--active' : ''} ${isDone ? 'task-card--done' : ''}`}
      style={{ '--task-color': color } as React.CSSProperties}
    >
      {/* Left color bar */}
      <div className="task-card__bar" />

      {/* Active glow overlay */}
      {isActive && <div className="task-card__glow" />}

      {/* Check button */}
      <button
        className={`task-card__check ${isDone ? 'task-card__check--done' : ''}`}
        onClick={handleComplete}
        aria-label={isDone ? '未着手に戻す' : '完了にする'}
        style={{ borderColor: color, background: isDone ? color : 'transparent' }}
      >
        {isDone && <span className="material-symbols-outlined fill" style={{ fontSize: '14px', color: '#fff' }}>check</span>}
      </button>

      {/* Content */}
      <div className="task-card__content">
        <div className="task-card__times">
          {task.startTime && (
            <span className="text-label-sm task-card__time-start" style={{ color: isActive ? color : 'var(--color-on-surface-variant)' }}>
              {task.startTime}
            </span>
          )}
          {task.endTime && (
            <span className="text-label-sm task-card__time-end" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.6 }}>
              {task.endTime}
            </span>
          )}
        </div>
        <div className="task-card__body">
          <h4 className="text-body-lg task-card__name" style={{ fontWeight: isActive ? 600 : 400 }}>
            {task.name}
          </h4>
          <div className="task-card__meta">
            {task.tag && (
              <span
                className="task-card__tag text-label-sm"
                style={{ background: `${color}18`, color }}
              >
                {task.tag}
              </span>
            )}
            {task.priority === 1 && (
              <span className="task-card__priority text-label-sm">
                HIGH
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Context menu */}
      <div className="task-card__menu-wrapper">
        <button
          className="task-card__menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="メニュー"
          style={{ opacity: isActive ? 1 : undefined }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
        </button>
        {menuOpen && (
          <div className="task-card__dropdown">
            <button className="task-card__dropdown-item" onClick={() => { handleComplete(); setMenuOpen(false); }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {isDone ? 'replay' : 'check_circle'}
              </span>
              {isDone ? '未着手に戻す' : '完了にする'}
            </button>
            <button
              className="task-card__dropdown-item task-card__dropdown-item--danger"
              onClick={() => { onDelete(task.id); setMenuOpen(false); }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
              削除
            </button>
          </div>
        )}
        {menuOpen && (
          <div className="task-card__dropdown-overlay" onClick={() => setMenuOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default TaskList;
