import React, { useEffect } from 'react';
import './Toast.css';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastMessage['type'], string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
};

const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="toast-container" role="region" aria-live="polite" aria-label="通知">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={`toast toast--${toast.type}`} role="alert">
      <span className="material-symbols-outlined fill toast__icon">
        {ICONS[toast.type]}
      </span>
      <span className="text-body-md toast__message">{toast.message}</span>
      <button
        className="toast__close"
        onClick={() => onDismiss(toast.id)}
        aria-label="閉じる"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
      </button>
    </div>
  );
};

export default Toast;
