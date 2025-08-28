import React from 'react';
import Icon from '@shared/components/AppIcon';

interface PasswordConfirmationIndicatorProps {
  password: string;
  confirmPassword: string;
  showIndicator?: boolean;
}

const PasswordConfirmationIndicator: React.FC<PasswordConfirmationIndicatorProps> = ({
  password,
  confirmPassword,
  showIndicator = true,
}) => {
  // Don't show anything if confirm password is empty
  if (!confirmPassword || !showIndicator) return null;

  const isMatching = password === confirmPassword;
  const hasMinLength = confirmPassword.length >= 1;

  if (!hasMinLength) return null;

  return (
    <div className={`mt-1 flex items-center text-sm ${isMatching ? 'text-green-600' : 'text-red-500'}`}>
      <Icon 
        name={isMatching ? "CheckCircle" : "XCircle"} 
        size={14} 
        className="mr-1" 
      />
      <span className="text-xs">
        {isMatching ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}
      </span>
    </div>
  );
};

export default PasswordConfirmationIndicator;