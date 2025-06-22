import React from 'react';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  className = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className='block text-sm font-medium text-text-primary mb-2'>
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
          error ? 'border-error' : 'border-border'
        } ${inputClassName}`}
        {...props}
      />
      {error && <p className='text-error text-sm mt-1'>{error}</p>}
    </div>
  );
};

export default TextInput;
