import React, { useState, useEffect, forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import Icon from '@shared/components/AppIcon';
import { 
  validateAndFormatFrenchPhone, 
  cleanPhoneForStorage, 
  getFrenchPhoneType
} from '@shared/utils/phoneFormatter';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  registration?: UseFormRegisterReturn;
  showValidationIcon?: boolean;
  showTypeHint?: boolean;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({
  value = '',
  onChange,
  onValidationChange,
  disabled = false,
  placeholder = 'Ex: 06 12 34 56 78',
  className = '',
  registration,
  showValidationIcon = true,
  showTypeHint = true,
}, ref) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [validationResult, setValidationResult] = useState({ isValid: true, error: '' });
  const [phoneType, setPhoneType] = useState('');

  // Synchroniser avec la valeur externe
  useEffect(() => {
    if (value !== displayValue) {
      const result = validateAndFormatFrenchPhone(value);
      setDisplayValue(result.formatted);
      setValidationResult({ isValid: result.isValid, error: result.error || '' });
      setPhoneType(result.isValid ? getFrenchPhoneType(cleanPhoneForStorage(result.formatted)) : '');
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const result = validateAndFormatFrenchPhone(inputValue);
    
    setDisplayValue(result.formatted);
    setValidationResult({ isValid: result.isValid, error: result.error || '' });
    
    // Déterminer le type de numéro si valide
    if (result.isValid && result.formatted) {
      const type = getFrenchPhoneType(cleanPhoneForStorage(result.formatted));
      setPhoneType(type);
    } else {
      setPhoneType('');
    }
    
    // Notifier le parent du changement
    if (onChange) {
      onChange(cleanPhoneForStorage(result.formatted));
    }
    
    // Notifier le parent de la validation
    if (onValidationChange) {
      onValidationChange(result.isValid, result.error);
    }
    
    // Appeler le registration onChange si fourni
    if (registration?.onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: cleanPhoneForStorage(result.formatted),
        },
      };
      registration.onChange(syntheticEvent);
    }
  };

  const handleBlur = () => {
    // Appeler le registration onBlur si fourni
    if (registration?.onBlur) {
      registration.onBlur({ type: 'blur', target: { value: cleanPhoneForStorage(displayValue) } });
    }
  };

  const getValidationIconName = () => {
    if (!displayValue) return null;
    if (validationResult.isValid) return 'CheckCircle';
    return 'AlertCircle';
  };

  const getValidationIconColor = () => {
    if (!displayValue) return '';
    if (validationResult.isValid) return 'text-success';
    return 'text-error';
  };

  const getBorderColor = () => {
    if (!displayValue) return 'border-border';
    if (validationResult.isValid) return 'border-success';
    return 'border-error';
  };

  const baseClassName = `w-full px-3 py-2 pr-10 border rounded-lg text-sm transition-all duration-200 ${
    disabled
      ? 'border-transparent bg-secondary-50 text-text-secondary cursor-not-allowed'
      : `bg-surface focus:ring-1 focus:ring-primary ${getBorderColor()}`
  } ${className}`;

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={ref}
          type="tel"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={baseClassName}
          {...(registration ? { name: registration.name } : {})}
          autoComplete="tel"
        />
        
        {showValidationIcon && displayValue && !disabled && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon
              name={getValidationIconName()!}
              size={16}
              className={getValidationIconColor()}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {!validationResult.isValid && validationResult.error && (
        <p className="mt-1 text-xs text-error flex items-center">
          <Icon name="AlertCircle" size={12} className="mr-1" />
          {validationResult.error}
        </p>
      )}

      {/* Indication du type de numéro */}
      {showTypeHint && validationResult.isValid && phoneType && phoneType !== 'invalide' && (
        <p className="mt-1 text-xs text-success flex items-center">
          <Icon name="Info" size={12} className="mr-1" />
          Numéro {phoneType} français valide
        </p>
      )}

    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;