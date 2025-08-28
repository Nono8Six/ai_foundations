import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthMeterProps {
  password: string;
  showText?: boolean;
  className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showText = true,
  className = '',
}) => {
  if (!password) return null;

  const result = zxcvbn(password);
  const score = result.score;

  const strengthConfig = {
    0: { label: 'Très faible', color: 'bg-red-500', textColor: 'text-red-600' },
    1: { label: 'Faible', color: 'bg-red-400', textColor: 'text-red-500' },
    2: { label: 'Moyen', color: 'bg-yellow-400', textColor: 'text-yellow-600' },
    3: { label: 'Bon', color: 'bg-blue-400', textColor: 'text-blue-600' },
    4: { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-600' },
  };

  const config = strengthConfig[score as keyof typeof strengthConfig];
  const widthPercentage = ((score + 1) / 5) * 100;

  return (
    <div className={`mt-2 ${className}`}>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${config.color}`}
          style={{ width: `${widthPercentage}%` }}
        />
      </div>

      {/* Text Feedback */}
      {showText && (
        <div className="mt-1 flex justify-between items-center text-sm">
          <span className={`font-medium ${config.textColor}`}>
            Force: {config.label}
          </span>
          {result.feedback.warning && (
            <span className="text-gray-600 text-xs">
              {result.feedback.warning}
            </span>
          )}
        </div>
      )}

      {/* Suggestions */}
      {showText && result.feedback.suggestions.length > 0 && (
        <div className="mt-1">
          <ul className="text-xs text-gray-500 space-y-0.5">
            {result.feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;