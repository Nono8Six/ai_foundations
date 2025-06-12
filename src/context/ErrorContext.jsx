import React, { createContext, useState, useContext } from 'react';
import { useToast } from './ToastContext';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const { addToast } = useToast();

  const reportError = error => {
    setErrors(prev => [...prev, error]);
    if (error?.message) {
      addToast(error.message, 'error');
    } else {
      addToast('An unexpected error occurred', 'error');
    }
    console.error(error);
  };

  return (
    <ErrorContext.Provider value={{ errors, reportError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
