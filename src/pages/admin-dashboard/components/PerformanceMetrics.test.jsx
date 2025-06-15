import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PerformanceMetrics from './PerformanceMetrics';

// Mock AppIcon
jest.mock('../../../components/AppIcon', () => ({ name, size, className }) => <svg data-testid={`icon-${name}`} className={className} width={size} height={size}></svg>);

describe('PerformanceMetrics', () => {
  test('renders available metrics correctly when props are provided', () => {
    const mockMetrics = {
      systemUptime: '99.9%',
      activeUsers: 150,
      // Other metrics that PerformanceMetrics doesn't use directly are ignored
    };
    render(<PerformanceMetrics metrics={mockMetrics} />);

    // Check for System Uptime
    expect(screen.getByText('Disponibilité système')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.getByTestId('icon-Shield')).toBeInTheDocument(); // Icon for uptime

    // Check for Active Sessions (derived from activeUsers)
    expect(screen.getByText('Sessions actives')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument(); // formatted from 150
    expect(screen.getByTestId('icon-Users')).toBeInTheDocument(); // Icon for active sessions

    // Check for the "detailed performance data unavailable" message
    expect(screen.getByText(/Les données de performance détaillées \(CPU, mémoire, etc.\) ne sont pas disponibles./)).toBeInTheDocument();

    // Check footer
    expect(screen.getByText('Informations de maintenance non disponibles.')).toBeInTheDocument();

    // Check online status (should be 'En ligne' if uptime is not N/A)
    expect(screen.getByText('En ligne')).toBeInTheDocument();
  });

  test('handles "N/A" for systemUptime and 0 activeUsers', () => {
    const mockMetrics = {
      systemUptime: 'N/A',
      activeUsers: 0,
    };
    render(<PerformanceMetrics metrics={mockMetrics} />);

    // System Uptime should show N/A
    expect(screen.getByText('Disponibilité système')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
     // Check status label for uptime (should be N/A)
    const uptimeValueElement = screen.getByText('N/A');
    const uptimeCard = uptimeValueElement.closest('div.p-4'); // Find the parent card
    expect(uptimeCard.textContent).toContain('N/A'); // Status label for unknown

    // Active Sessions should show 0
    expect(screen.getByText('Sessions actives')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();

    // Online status should reflect N/A uptime
    expect(screen.getByText('Statut inconnu')).toBeInTheDocument();
  });

   test('handles error value for systemUptime', () => {
    const mockMetrics = {
      systemUptime: 'Error',
      activeUsers: 10,
    };
    render(<PerformanceMetrics metrics={mockMetrics} />);

    expect(screen.getByText('Disponibilité système')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    const uptimeValueElement = screen.getByText('Error');
    const uptimeCard = uptimeValueElement.closest('div.p-4');
    expect(uptimeCard.textContent).toContain('N/A'); // Status label for unknown

    expect(screen.getByText('Statut inconnu')).toBeInTheDocument();
  });

  test('renders "No metrics available" when metrics prop is empty or undefined', () => {
    render(<PerformanceMetrics metrics={{}} />); // Empty metrics object
    expect(screen.getByText('Aucune métrique système disponible.')).toBeInTheDocument();
    expect(screen.getByTestId('icon-ServerOff')).toBeInTheDocument();

    // Also test with undefined metrics
    render(<PerformanceMetrics metrics={undefined} />);
    expect(screen.getByText('Aucune métrique système disponible.')).toBeInTheDocument();
  });

  test('renders correctly when only systemUptime is available', () => {
    const mockMetrics = { systemUptime: '99.5%' };
    render(<PerformanceMetrics metrics={mockMetrics} />);

    expect(screen.getByText('Disponibilité système')).toBeInTheDocument();
    expect(screen.getByText('99.5%')).toBeInTheDocument();
    expect(screen.queryByText('Sessions actives')).not.toBeInTheDocument();
    expect(screen.getByText(/Les données de performance détaillées \(CPU, mémoire, etc.\) ne sont pas disponibles./)).toBeInTheDocument();
  });

  test('renders correctly when only activeUsers is available', () => {
    const mockMetrics = { activeUsers: 77 };
    render(<PerformanceMetrics metrics={mockMetrics} />);

    expect(screen.getByText('Sessions actives')).toBeInTheDocument();
    expect(screen.getByText('77')).toBeInTheDocument();
    expect(screen.queryByText('Disponibilité système')).not.toBeInTheDocument();
    // It will still show "detailed performance data unavailable" because one of the core metrics (uptime) is missing
    // Or, if we change the logic to show it only if *both* are missing, this test would change.
    // Current logic: if availableMetrics > 0, it shows the list + the detailed info box.
    expect(screen.getByText(/Les données de performance détaillées \(CPU, mémoire, etc.\) ne sont pas disponibles./)).toBeInTheDocument();
  });
});
