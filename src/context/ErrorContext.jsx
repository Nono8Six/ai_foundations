// src/context/ErrorContext.jsx

import React, { createContext, useContext } from 'react';

const ErrorContext = createContext(() => {});

let externalLogger = console.error;

export const ErrorProvider = ({ children, logger = console.error }) => {
  externalLogger = logger;
  return <ErrorContext.Provider value={logger}>{children}</ErrorContext.Provider>;
};

export const useErrorLogger = () => useContext(ErrorContext);

export const logError = error => {
  externalLogger(error);
};

export default ErrorContext;