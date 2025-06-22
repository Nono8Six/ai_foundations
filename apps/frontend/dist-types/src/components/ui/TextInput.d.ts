import React from 'react';
export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
    label?: string;
    error?: string;
    className?: string;
    inputClassName?: string;
}
declare const TextInput: React.FC<TextInputProps>;
export default TextInput;
