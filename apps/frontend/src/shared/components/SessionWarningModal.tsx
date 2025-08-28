import React, { useEffect, useState } from 'react';
import Icon from '@shared/components/AppIcon';
import Button from '@shared/ui/Button';
import Card from '@shared/ui/Card';

interface SessionWarningModalProps {
  show: boolean;
  timeRemaining: number; // in milliseconds
  onExtend: () => void;
  onLogout: () => void;
}

const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  show,
  timeRemaining,
  onExtend,
  onLogout,
}) => {
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setDisplayTime(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  const minutes = Math.floor(displayTime / 60000);
  const seconds = Math.floor((displayTime % 60000) / 1000);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Icon 
                name="Clock" 
                size={24} 
                className="text-yellow-500" 
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-primary">
                Session expiring soon
              </h3>
              <p className="text-sm text-text-secondary">
                Your session will expire due to inactivity
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-mono font-bold text-yellow-700">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <p className="text-sm text-yellow-600 mt-1">
              Time remaining
            </p>
          </div>

          {/* Message */}
          <p className="text-sm text-text-secondary text-center">
            You will be automatically logged out to protect your account. 
            Click "Stay logged in" to extend your session.
          </p>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onLogout}
              className="flex-1"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Logout now
            </Button>
            <Button
              type="button"
              onClick={onExtend}
              className="flex-1"
            >
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Stay logged in
            </Button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.max(0, (displayTime / (5 * 60 * 1000)) * 100)}%` 
              }}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default SessionWarningModal;