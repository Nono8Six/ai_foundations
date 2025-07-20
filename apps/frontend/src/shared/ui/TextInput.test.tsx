import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextInput from './TextInput';

describe('TextInput', () => {
  it('renders label and error', () => {
    render(<TextInput label='Email' error='Required' id='email' />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('forwards props to input', () => {
    const onChange = vi.fn();
    render(
      <TextInput
        id='name'
        placeholder='Name'
        onChange={onChange}
        className='wrapper'
        inputClassName='inner'
      />
    );
    const input = screen.getByPlaceholderText('Name');
    expect(input).toHaveClass('inner');
    fireEvent.change(input, { target: { value: 'John' } });
    expect(onChange).toHaveBeenCalled();
    expect(input.closest('div')).toHaveClass('wrapper');
  });
});
