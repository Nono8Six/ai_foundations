import React, { forwardRef } from 'react';

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string | undefined;
  className?: string;
  inputClassName?: string;
}

export type Props = TextInputProps;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  label,
  error,
  className = '',
  inputClassName = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={props.id}
          className='block text-sm font-medium text-text-primary mb-2'
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
          error ? 'border-error' : 'border-border'
        } ${inputClassName}`}
        {...props}
      />
      {error && <p className='text-error text-sm mt-1'>{error}</p>}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
