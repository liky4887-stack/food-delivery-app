import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Toast {
  id: string;
  message: string;
  icon?: string;
  autoDismiss?: number;
}

export type ToastAction = 'show' | 'hide' | 'clear';

export interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Toast) => void;
  hideToast: (toastId: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Toast) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message: toast.message, autoDismiss: toast.autoDismiss ?? 5000 }]);
  }, []);

  const hideToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearAll }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
