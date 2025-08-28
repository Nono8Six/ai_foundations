import { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordValidation {
  score: number;
  isValid: boolean;
  feedback: {
    warning?: string;
    suggestions: string[];
  };
  requirements: {
    minLength: boolean;
    hasLower: boolean;
    hasUpper: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export const usePasswordValidation = (password: string): PasswordValidation => {
  const [validation, setValidation] = useState<PasswordValidation>({
    score: 0,
    isValid: false,
    feedback: { suggestions: [] },
    requirements: {
      minLength: false,
      hasLower: false,
      hasUpper: false,
      hasNumber: false,
      hasSpecial: false,
    },
  });

  useEffect(() => {
    if (!password) {
      setValidation({
        score: 0,
        isValid: false,
        feedback: { suggestions: [] },
        requirements: {
          minLength: false,
          hasLower: false,
          hasUpper: false,
          hasNumber: false,
          hasSpecial: false,
        },
      });
      return;
    }

    const result = zxcvbn(password);
    
    const requirements = {
      minLength: password.length >= 8,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password),
    };

    const isValid = Object.values(requirements).every(Boolean) && result.score >= 2;

    setValidation({
      score: result.score,
      isValid,
      feedback: {
        warning: result.feedback.warning,
        suggestions: result.feedback.suggestions,
      },
      requirements,
    });
  }, [password]);

  return validation;
};