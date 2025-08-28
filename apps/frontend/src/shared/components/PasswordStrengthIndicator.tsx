import React from 'react';
import { usePasswordValidation } from '@shared/hooks/usePasswordValidation';
import Icon from '@shared/components/AppIcon';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
  className = '',
}) => {
  const validation = usePasswordValidation(password);

  if (!password) return null;

  const strengthConfig = {
    0: { label: 'Très faible', color: 'bg-red-500', textColor: 'text-red-600' },
    1: { label: 'Faible', color: 'bg-red-400', textColor: 'text-red-500' },
    2: { label: 'Moyen', color: 'bg-yellow-400', textColor: 'text-yellow-600' },
    3: { label: 'Bon', color: 'bg-blue-400', textColor: 'text-blue-600' },
    4: { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-600' },
  };

  const config = strengthConfig[validation.score as keyof typeof strengthConfig];
  const widthPercentage = ((validation.score + 1) / 5) * 100;

  const requirements = [
    { key: 'minLength', label: 'Au moins 8 caractères', met: validation.requirements.minLength },
    { key: 'hasLower', label: 'Une minuscule (a-z)', met: validation.requirements.hasLower },
    { key: 'hasUpper', label: 'Une majuscule (A-Z)', met: validation.requirements.hasUpper },
    { key: 'hasNumber', label: 'Un chiffre (0-9)', met: validation.requirements.hasNumber },
    { key: 'hasSpecial', label: 'Un caractère spécial (@$!%*?&)', met: validation.requirements.hasSpecial },
  ];

  return (
    <div className={`mt-2 ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${config.color}`}
          style={{ width: `${widthPercentage}%` }}
        />
      </div>

      {/* Strength Label */}
      <div className="mt-1 flex justify-between items-center text-sm">
        <span className={`font-medium ${config.textColor}`}>
          Force: {config.label}
        </span>
        {validation.isValid && (
          <div className="flex items-center text-green-600">
            <Icon name="CheckCircle" size={16} className="mr-1" />
            <span className="text-xs font-medium">Valide</span>
          </div>
        )}
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="mt-2 space-y-1">
          {requirements.map((req) => (
            <div key={req.key} className="flex items-center text-xs">
              <Icon
                name={req.met ? "CheckCircle" : "Circle"}
                size={14}
                className={`mr-2 ${req.met ? 'text-green-500' : 'text-gray-400'}`}
              />
              <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Feedback from zxcvbn */}
      {validation.feedback.warning && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
          <Icon name="AlertTriangle" size={14} className="inline mr-1" />
          {validation.feedback.warning}
        </div>
      )}

      {validation.feedback.suggestions.length > 0 && (
        <div className="mt-1">
          <ul className="text-xs text-gray-600 space-y-0.5">
            {validation.feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-1 text-blue-500">💡</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;