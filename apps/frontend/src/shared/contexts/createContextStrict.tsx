import { createContext, useContext } from 'react';

export function createContextStrict<T>() {
  const Context = createContext<T | undefined>(undefined);
  const useStrictContext = () => {
    const value = useContext(Context);
    if (value === undefined) {
      throw new Error('useContext must be inside its Provider');
    }
    return value;
  };
  return [Context, useStrictContext] as const;
}
