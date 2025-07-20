import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('applies variant, size and forwards events', () => {
    const onClick = vi.fn();
    render(
      <Button variant='secondary' size='lg' className='extra' onClick={onClick}>
        Save
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveClass('bg-secondary');
    expect(btn).toHaveClass('px-6');
    expect(btn).toHaveClass('extra');
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });
});
