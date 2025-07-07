import { createContextStrict } from './createContextStrict';
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { log } from '@libs/logger';

interface SessionContextValue {
  isActive: boolean;
  isPaused: boolean;
  elapsedTime: number;
  startSession: () => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => Promise<void>;
}

const [SessionContext, useSession] = createContextStrict<SessionContextValue>();

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<number>();

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const tick = () => {
    setElapsedTime(t => t + 1);
  };

  const startTimer = () => {
    clearTimer();
    intervalRef.current = window.setInterval(tick, 1000);
  };

  const startSession = async () => {
    if (isActive) return;
    try {
      await fetch('/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });
      setIsActive(true);
      setIsPaused(false);
      setElapsedTime(0);
      startTimer();
    } catch (err) {
      log.error('Failed to start session', err);
    }
  };

  const pauseSession = () => {
    if (!isActive || isPaused) return;
    setIsPaused(true);
    clearTimer();
  };

  const resumeSession = () => {
    if (!isActive || !isPaused) return;
    setIsPaused(false);
    startTimer();
  };

  const stopSession = async () => {
    if (!isActive) return;
    clearTimer();
    setIsActive(false);
    setIsPaused(false);
    const duration = elapsedTime;
    setElapsedTime(0);
    try {
      await fetch('/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' }),
      });
      await fetch('/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration }),
      });
    } catch (err) {
      log.error('Failed to stop session', err);
    }
  };

  useEffect(() => clearTimer, []);

  const value: SessionContextValue = {
    isActive,
    isPaused,
    elapsedTime,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export { useSession };
