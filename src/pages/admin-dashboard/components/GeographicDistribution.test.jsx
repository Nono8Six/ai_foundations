import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import GeographicDistribution from './GeographicDistribution';

// Mock AppIcon
vi.mock('../../../components/AppIcon', () => ({ default: ({ name, size, className }) => <svg data-testid={`icon-${name}`} className={className} width={size} height={size}></svg> }));

describe('GeographicDistribution', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  test('renders "data unavailable" message', () => {
    render(<GeographicDistribution />);

    // Check for the main title
    expect(screen.getByText('Distribution géographique')).toBeInTheDocument();
    expect(screen.getByText('Répartition des utilisateurs par pays')).toBeInTheDocument();

    // Check for the "unavailable" message and icon
    expect(screen.getByText('Les données de distribution géographique ne sont pas actuellement disponibles.')).toBeInTheDocument();
    expect(screen.getByText('Pour activer cette fonctionnalité, des informations de localisation des utilisateurs seraient nécessaires.')).toBeInTheDocument();
    expect(screen.getByTestId('icon-MapOff')).toBeInTheDocument();

    // Check that the footer shows N/A
    expect(screen.getByText('Total utilisateurs (géographique)')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();

    // Ensure no country list items are rendered (example check)
    // (This depends on how you'd identify them, e.g., by a role or testId if they existed)
    // For example, if countries were listitems:
    // expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    // Or checking for a specific country name from the old mock data:
    expect(screen.queryByText('France')).not.toBeInTheDocument();
  });
});
