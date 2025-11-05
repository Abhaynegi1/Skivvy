import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((opts) => {
    const id = Math.random().toString(36).slice(2);
    const toast = {
      id,
      title: opts.title || '',
      message: opts.message || '',
      type: opts.type || 'info', // success | error | info
      duration: opts.duration ?? 3000,
    };
    setToasts((t) => [...t, toast]);
    if (toast.duration > 0) {
      setTimeout(() => remove(id), toast.duration);
    }
  }, [remove]);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div className="fixed top-20 right-4 z-[9999] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[260px] max-w-sm rounded-xl shadow-lg border px-4 py-3 text-sm backdrop-blur bg-white/95 ${
              t.type === 'success' ? 'border-green-200' : t.type === 'error' ? 'border-red-200' : 'border-orange-200'
            }`}
          >
            {t.title && <div className="font-semibold text-gray-800 mb-0.5">{t.title}</div>}
            <div className={`text-gray-700`}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};


