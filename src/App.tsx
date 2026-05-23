import React, { useState, useEffect, useCallback } from 'react';
import './styles/global.css';
import './App.css';

import TopBar from './components/TopBar/TopBar';
import Sidebar from './components/Sidebar/Sidebar';
import CurrentTimeDisplay from './components/CurrentTimeDisplay/CurrentTimeDisplay';
import ClockFace from './components/ClockFace/ClockFace';
import TaskList from './components/TaskList/TaskList';
import AddTaskSheet from './components/AddTaskSheet/AddTaskSheet';
import Toast, { type ToastMessage } from './components/Toast/Toast';
import CompetitiveAnalysis from './components/CompetitiveAnalysis/CompetitiveAnalysis';
import MentalGpaRescue from './components/MentalGpaRescue/MentalGpaRescue';

import type { Task } from './types';
import {
  loadTasks,
  addTask as storeAddTask,
  updateTaskStatus,
  deleteTask as storeDeleteTask,
  getTodayTasks,
  getCurrentTask,
} from './store/taskStore';
import { generateId, todayStr } from './utils/constants';

const App: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentView, setCurrentView] = useState<'app' | 'competitors'>('app');

  // Derived
  const todayTasks = getTodayTasks(tasks);
  const currentTask = getCurrentTask(tasks);
  const completedToday = tasks.filter(
    (t) => t.date === todayStr() && t.status === '完了'
  ).length;
  const totalToday = tasks.filter((t) => t.date === todayStr()).length;

  // Clock tick
  useEffect(() => {
    const tick = () => setCurrentTime(new Date());
    tick();
    const id = setInterval(tick, 30000); // update every 30s
    return () => clearInterval(id);
  }, []);

  // Toast helpers
  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Task handlers
  const handleAddTask = (task: Task) => {
    setTasks((prev) => storeAddTask(prev, task));
    addToast('タスクを追加しました', 'success');
  };

  const handleStatusChange = (id: string, status: Task['status']) => {
    setTasks((prev) => updateTaskStatus(prev, id, status));
    if (status === '完了') {
      addToast('タスクを完了しました ✓', 'success');
    }
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => storeDeleteTask(prev, id));
    addToast('タスクを削除しました', 'info');
  };

  const handleApplyGpaTask = (task: Omit<Task, 'id' | 'date'>) => {
    const fullTask: Task = {
      ...task,
      id: generateId(),
      date: todayStr(),
    };
    setTasks((prev) => storeAddTask(prev, fullTask));
    addToast('AI推奨課題をスケジュールに追加しました！', 'success');
  };

  return (
    <div className="app">
      {/* Background ambient glow */}
      <div className="app__bg-glow" aria-hidden="true" />

      {/* Top App Bar */}
      <TopBar
        onMenuClick={() => setIsSidebarOpen(true)}
        onSettingsClick={() => addToast('設定は準備中です', 'info')}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        tasks={tasks}
        onAddTask={() => setIsAddSheetOpen(true)}
        onStatusChange={handleStatusChange}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Content */}
      <main className="app__main">
        {currentView === 'app' ? (
          <>
            {/* Current Time */}
            <CurrentTimeDisplay
              currentTime={currentTime}
              subtitle={currentTask ? `▶ ${currentTask.name}` : undefined}
            />

            {/* 24h Clock */}
            <ClockFace
              tasks={tasks}
              currentTask={currentTask}
              currentTime={currentTime}
            />

            {/* Today's tasks section */}
            <section className="app__tasks-section">
              <div className="app__section-header">
                <h2 className="text-headline-md">今日のタスク</h2>
                <div className="app__progress">
                  <span className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {completedToday} / {totalToday}
                  </span>
                  <div className="app__progress-bar">
                    <div
                      className="app__progress-fill"
                      style={{ width: totalToday > 0 ? `${(completedToday / totalToday) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>

              <TaskList
                tasks={todayTasks}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                currentTaskId={currentTask?.id}
              />
            </section>

            {/* GPA Rescue & Mental Care AI integrated inline */}
            <section className="app__rescue-section">
              <MentalGpaRescue onApplyTask={handleApplyGpaTask} />
            </section>

            {/* FAB: Add task */}
            <button
              className="app__fab"
              onClick={() => setIsAddSheetOpen(true)}
              aria-label="タスクを追加"
              id="fab-add-task"
            >
              <span className="material-symbols-outlined fill" style={{ fontSize: '28px' }}>add</span>
            </button>
          </>
        ) : (
          <CompetitiveAnalysis onViewChange={() => setCurrentView('app')} />
        )}
      </main>

      {/* Add Task Sheet */}
      <AddTaskSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        onAdd={handleAddTask}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
