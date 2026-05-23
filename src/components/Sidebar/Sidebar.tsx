import React from 'react';
import type { Task } from '../../types';
import { todayStr } from '../../utils/constants';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onAddTask: () => void;
  onStatusChange: (id: string, status: Task['status']) => void;
  currentView: 'app' | 'competitors';
  onViewChange: (view: 'app' | 'competitors') => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  tasks,
  onAddTask,
  onStatusChange,
  currentView,
  onViewChange,
}) => {
  const today = todayStr();
  const todayTasks = tasks
    .filter((t) => t.date === today)
    .sort((a, b) => {
      const aTime = a.startTime ?? '00:00';
      const bTime = b.startTime ?? '00:00';
      return aTime.localeCompare(bTime);
    });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--visible' : ''}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <nav
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        aria-label="サイドメニュー"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sidebar__header">
          <span className="text-headline-md" style={{ color: 'var(--color-primary)' }}>
            Menu
          </span>
          <button
            className="sidebar__close-btn"
            onClick={onClose}
            aria-label="閉じる"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="sidebar__section">
          <p className="sidebar__section-label text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            ナビゲーション
          </p>
          <button
            className={`sidebar__action-btn ${currentView === 'app' ? 'sidebar__action-btn--active' : ''}`}
            onClick={() => { onViewChange('app'); onClose(); }}
          >
            <span className="material-symbols-outlined">schedule</span>
            <span>🕒 スケジューラー</span>
          </button>
          <button
            className={`sidebar__action-btn ${currentView === 'competitors' ? 'sidebar__action-btn--active' : ''}`}
            onClick={() => { onViewChange('competitors'); onClose(); }}
          >
            <span className="material-symbols-outlined">analytics</span>
            <span>📊 競合分析 ＆ プレゼン</span>
          </button>
        </div>

        <div className="sidebar__divider" />

        {/* Actions */}
        <div className="sidebar__section">
          <p className="sidebar__section-label text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            クイックアクション
          </p>
          <button className="sidebar__action-btn sidebar__action-btn--primary" onClick={() => { onAddTask(); onClose(); }} id="sidebar-add-text">
            <span className="material-symbols-outlined">add_circle</span>
            <span>新規タスクを追加</span>
          </button>
          <button className="sidebar__action-btn" disabled id="sidebar-add-voice">
            <span className="material-symbols-outlined">mic</span>
            <span>音声で追加（準備中）</span>
          </button>
          <button className="sidebar__action-btn" disabled id="sidebar-add-image">
            <span className="material-symbols-outlined">photo_camera</span>
            <span>画像で追加（準備中）</span>
          </button>
        </div>

        <div className="sidebar__divider" />

        {/* Today's tasks */}
        <div className="sidebar__section sidebar__section--grow">
          <p className="sidebar__section-label text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            今日のタスク
          </p>
          <div className="sidebar__task-list">
            {todayTasks.length === 0 && (
              <p className="sidebar__empty text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                今日のタスクはありません
              </p>
            )}
            {todayTasks.map((task) => (
              <SidebarTaskItem
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </div>

        <div className="sidebar__divider" />

        {/* Footer */}
        <div className="sidebar__footer">
          <button className="sidebar__footer-btn" id="sidebar-settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-label-lg">設定</span>
          </button>
        </div>
      </nav>
    </>
  );
};

interface SidebarTaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const SidebarTaskItem: React.FC<SidebarTaskItemProps> = ({ task, onStatusChange }) => {
  const colorMap: Record<string, string> = {
    red: '#EF4444', orange: '#F97316', yellow: '#EAB308',
    green: '#22C55E', blue: '#3B82F6', purple: '#A855F7', gray: '#9CA3AF',
  };
  const color = colorMap[task.color] || colorMap.gray;

  const handleToggle = () => {
    onStatusChange(task.id, task.status === '完了' ? '未着手' : '完了');
  };

  return (
    <div className={`sidebar-task ${task.status === '完了' ? 'sidebar-task--done' : ''}`}>
      <button
        className="sidebar-task__dot"
        style={{ background: color }}
        onClick={handleToggle}
        aria-label={task.status === '完了' ? '未着手に戻す' : '完了にする'}
      />
      <div className="sidebar-task__body">
        <span className="sidebar-task__name text-body-md">{task.name}</span>
        {task.startTime && (
          <span className="sidebar-task__time text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            {task.startTime}{task.endTime ? ` → ${task.endTime}` : ''}
          </span>
        )}
      </div>
      <span className={`sidebar-task__status text-label-sm ${
        task.status === '進行中' ? 'sidebar-task__status--active' : ''
      }`}>
        {task.status === '進行中' ? '進行中' : task.status === '完了' ? '完了' : ''}
      </span>
    </div>
  );
};

export default Sidebar;
