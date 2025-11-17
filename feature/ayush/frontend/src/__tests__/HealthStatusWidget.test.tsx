/**
 * CON-9, CON-12: Tests for Health Status Widget
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import HealthStatusWidget from '../components/health-status-widget/HealthStatusWidget';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HealthStatusWidget (CON-9, CON-12)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should show loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<HealthStatusWidget />);
    expect(screen.getByText('Loading health status...')).toBeInTheDocument();
  });

  it('should display health status when data is loaded', async () => {
    const mockHealthData = {
      status: 'healthy',
      uptime: 3600,
      uptimePercentage: 99.8,
      services: {
        database: 'up',
        api: 'up',
      },
    };

    mockedAxios.get.mockResolvedValue({ data: mockHealthData });

    await act(async () => {
      render(<HealthStatusWidget />);
    });

    await waitFor(() => {
      expect(screen.getByText('Service Health Status (CON-9)')).toBeInTheDocument();
    });

    expect(screen.getByText('HEALTHY')).toBeInTheDocument();
    expect(screen.getByText(/99.8%/)).toBeInTheDocument();
  });

  it('should display unhealthy status correctly', async () => {
    const mockHealthData = {
      status: 'unhealthy',
      uptime: 100,
      uptimePercentage: 95.0,
      services: {
        database: 'down',
        api: 'up',
      },
    };

    mockedAxios.get.mockResolvedValue({ data: mockHealthData });

    await act(async () => {
      render(<HealthStatusWidget />);
    });

    await waitFor(() => {
      expect(screen.getByText('UNHEALTHY')).toBeInTheDocument();
    });
  });

  it('should show target met indicator when uptime >= 99.5%', async () => {
    const mockHealthData = {
      status: 'healthy',
      uptime: 3600,
      uptimePercentage: 99.5,
      services: {
        database: 'up',
        api: 'up',
      },
    };

    mockedAxios.get.mockResolvedValue({ data: mockHealthData });

    await act(async () => {
      render(<HealthStatusWidget />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Target Met \(99.5%\)/)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    await act(async () => {
      render(<HealthStatusWidget />);
    });

    await waitFor(() => {
      expect(screen.getByText('Unable to fetch health status')).toBeInTheDocument();
    });
  });

  it('should refresh health status periodically', async () => {
    const mockHealthData = {
      status: 'healthy',
      uptime: 3600,
      uptimePercentage: 99.8,
      services: {
        database: 'up',
        api: 'up',
      },
    };

    mockedAxios.get.mockResolvedValue({ data: mockHealthData });

    await act(async () => {
      render(<HealthStatusWidget />);
    });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    // Fast-forward 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });

  it('should display all service statuses', async () => {
    const mockHealthData = {
      status: 'healthy',
      uptime: 3600,
      uptimePercentage: 99.8,
      services: {
        database: 'up',
        api: 'up',
      },
    };

    mockedAxios.get.mockResolvedValue({ data: mockHealthData });

    await act(async () => {
      render(<HealthStatusWidget />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Database:/)).toBeInTheDocument();
      expect(screen.getByText(/API:/)).toBeInTheDocument();
    });
  });
});

