import React, { useState, useEffect } from 'react';
import type { Task, TaskFormData, TaskColor } from '../../types';
import { COLOR_MAP, COLOR_KEYS, generateId, todayStr } from '../../utils/constants';
import './AddTaskSheet.css';

interface AddTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
}

const defaultForm = (): TaskFormData => ({
  name: '',
  date: todayStr(),
  startTime: '',
  endTime: '',
  status: '未着手',
  color: 'blue',
  memo: '',
  tag: '',
  priority: 2,
});

const AddTaskSheet: React.FC<AddTaskSheetProps> = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState<TaskFormData>(defaultForm());
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(defaultForm());
      setErrors({});
      setIsExiting(false);
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'タスク名は必須です';
    if (form.name.length > 100) newErrors.name = '100文字以内で入力してください';
    if (!form.date) newErrors.date = '日付は必須です';
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      // Overnight tasks (e.g., 23:00 → 07:00) are valid if endTime < startTime
      // We allow it, just no error
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const task: Task = {
      id: generateId(),
      name: form.name.trim(),
      date: form.date,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
      status: form.status,
      color: form.color,
      memo: form.memo || undefined,
      tag: form.tag || undefined,
      priority: form.priority,
    };

    onAdd(task);
    handleClose();
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 250);
  };

  if (!isOpen && !isExiting) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`sheet-backdrop ${isOpen && !isExiting ? 'sheet-backdrop--visible' : ''}`}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={`add-task-sheet ${isOpen && !isExiting ? 'add-task-sheet--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="タスクを追加"
      >
        {/* Handle */}
        <div className="add-task-sheet__handle" />

        {/* Header */}
        <div className="add-task-sheet__header">
          <h2 className="text-headline-md">新規タスクを追加</h2>
          <button className="add-task-sheet__close" onClick={handleClose} aria-label="閉じる">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form className="add-task-sheet__form" onSubmit={handleSubmit} noValidate>
          {/* Task name */}
          <div className="form-field">
            <label className="form-label text-label-lg" htmlFor="task-name">タスク名 *</label>
            <input
              id="task-name"
              type="text"
              className={`form-input ${errors.name ? 'form-input--error' : ''}`}
              placeholder="例：MTGの議事録を書く"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              maxLength={100}
              autoFocus
            />
            {errors.name && <span className="form-error text-label-sm">{errors.name}</span>}
          </div>

          {/* Date */}
          <div className="form-field">
            <label className="form-label text-label-lg" htmlFor="task-date">日付 *</label>
            <input
              id="task-date"
              type="date"
              className={`form-input ${errors.date ? 'form-input--error' : ''}`}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            {errors.date && <span className="form-error text-label-sm">{errors.date}</span>}
          </div>

          {/* Time range */}
          <div className="form-row">
            <div className="form-field">
              <label className="form-label text-label-lg" htmlFor="task-start">開始時刻</label>
              <input
                id="task-start"
                type="time"
                className="form-input"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              />
            </div>
            <div className="form-field">
              <label className="form-label text-label-lg" htmlFor="task-end">終了時刻</label>
              <input
                id="task-end"
                type="time"
                className="form-input"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Tag */}
          <div className="form-field">
            <label className="form-label text-label-lg" htmlFor="task-tag">タグ</label>
            <input
              id="task-tag"
              type="text"
              className="form-input"
              placeholder="例：Work, Health, Rest..."
              value={form.tag}
              onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
            />
          </div>

          {/* Priority */}
          <div className="form-field">
            <label className="form-label text-label-lg">優先度</label>
            <div className="priority-selector">
              {([1, 2, 3] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`priority-btn ${form.priority === p ? 'priority-btn--active' : ''}`}
                  style={form.priority === p ? {
                    background: p === 1 ? 'rgba(239,68,68,0.2)' : p === 2 ? 'rgba(234,179,8,0.2)' : 'rgba(156,163,175,0.2)',
                    borderColor: p === 1 ? '#EF4444' : p === 2 ? '#EAB308' : '#9CA3AF',
                    color: p === 1 ? '#EF4444' : p === 2 ? '#EAB308' : '#9CA3AF',
                  } : {}}
                  onClick={() => setForm((f) => ({ ...f, priority: p }))}
                >
                  {p === 1 ? '高' : p === 2 ? '中' : '低'}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="form-field">
            <label className="form-label text-label-lg">カラー</label>
            <div className="color-picker">
              {COLOR_KEYS.map((key: TaskColor) => {
                const c = COLOR_MAP[key];
                return (
                  <button
                    key={key}
                    type="button"
                    className={`color-chip ${form.color === key ? 'color-chip--selected' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => setForm((f) => ({ ...f, color: key }))}
                    aria-label={c.label}
                    title={c.label}
                  >
                    {form.color === key && (
                      <span className="material-symbols-outlined fill" style={{ fontSize: '14px', color: '#fff' }}>
                        check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Memo */}
          <div className="form-field">
            <label className="form-label text-label-lg" htmlFor="task-memo">メモ</label>
            <textarea
              id="task-memo"
              className="form-input form-textarea"
              placeholder="補足情報・詳細を入力..."
              value={form.memo}
              onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="add-task-sheet__actions">
            <button type="button" className="btn btn--secondary" onClick={handleClose}>
              キャンセル
            </button>
            <button type="submit" className="btn btn--primary" id="submit-task">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              タスクを追加
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTaskSheet;
