import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  icon?: 'success' | 'info';
}

interface ToastContextType {
  showToast: (message: string, icon?: 'success' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, icon: 'success' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="absolute top-12 left-0 right-0 z-[60] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-neutral-900 text-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2.5 animate-slide-up max-w-[340px] w-full pointer-events-auto"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            <span className="text-[14px] font-medium flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="shrink-0">
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
