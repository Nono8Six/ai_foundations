import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = id => setToasts(prev => prev.filter(t => t.id !== id));

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className='fixed bottom-4 right-4 space-y-2 z-50'>
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow-subtle text-white animate-fade-in ${
              t.type === 'error' ? 'bg-error' : 'bg-success'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
