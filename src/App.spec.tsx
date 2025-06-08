import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1, name: /ia foundations lms/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the edit text', () => {
    render(<App />);
    const editText = screen.getByText(/edit src\/App\.tsx and save to reload/i);
    expect(editText).toBeInTheDocument();
  });

  it('renders the learn react link', () => {
    render(<App />);
    const linkElement = screen.getByRole('link', { name: /learn react/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://reactjs.org');
  });
});
