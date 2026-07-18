import React, { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const api = useMemo(
    () => ({
      toast: ({ title, message, type = 'info' }) => {
        const id = String(Date.now()) + Math.random().toString(16).slice(2);
        setToasts((t) => [...t, { id, title, message, type }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
      }
    }),
    []
  );

  return <ToastContext.Provider value={api}>{children}{toasts.length ? <ToastStack toasts={toasts} /> : null}</ToastContext.Provider>;
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`shadow-lg rounded-xl px-4 py-3 border backdrop-blur bg-base-100/80 text-base-content ${
            t.type === 'error' ? 'border-error' : t.type === 'success' ? 'border-success' : 'border-neutral'
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="font-semibold">{t.title}</div>
          {t.message ? <div className="opacity-80 text-sm">{t.message}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

