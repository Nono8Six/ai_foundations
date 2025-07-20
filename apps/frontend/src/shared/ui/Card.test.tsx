import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <p>Content</p>
      </Card>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card className='extra'>Box</Card>);
    const card = screen.getByText('Box');
    expect(card).toHaveClass('extra');
  });
});
