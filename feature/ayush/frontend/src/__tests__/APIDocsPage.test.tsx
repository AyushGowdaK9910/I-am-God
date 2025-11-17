/**
 * CON-12: Tests for API Documentation Page
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import APIDocsPage from '../pages/api-docs/APIDocsPage';

// Mock the child components
jest.mock('../components/DocsViewer/DocsViewer', () => {
  return function MockDocsViewer({ mode }: { mode: 'swagger' | 'redoc' }) {
    return <div data-testid="docs-viewer">Docs Viewer: {mode}</div>;
  };
});

jest.mock('../components/health-status-widget/HealthStatusWidget', () => {
  return function MockHealthStatusWidget() {
    return <div data-testid="health-widget">Health Widget</div>;
  };
});

describe('APIDocsPage (CON-12)', () => {
  it('should render the page title', () => {
    render(<APIDocsPage />);
    expect(screen.getByText('API Documentation (CON-12)')).toBeInTheDocument();
  });

  it('should render health status widget', () => {
    render(<APIDocsPage />);
    expect(screen.getByTestId('health-widget')).toBeInTheDocument();
  });

  it('should render Swagger UI button', () => {
    render(<APIDocsPage />);
    expect(screen.getByText('Swagger UI')).toBeInTheDocument();
  });

  it('should render Redoc button', () => {
    render(<APIDocsPage />);
    expect(screen.getByText('Redoc')).toBeInTheDocument();
  });

  it('should default to Swagger view mode', () => {
    render(<APIDocsPage />);
    const viewer = screen.getByTestId('docs-viewer');
    expect(viewer).toHaveTextContent('Docs Viewer: swagger');
  });

  it('should switch to Redoc when Redoc button is clicked', () => {
    render(<APIDocsPage />);
    const redocButton = screen.getByText('Redoc');
    fireEvent.click(redocButton);

    const viewer = screen.getByTestId('docs-viewer');
    expect(viewer).toHaveTextContent('Docs Viewer: redoc');
  });

  it('should switch back to Swagger when Swagger button is clicked', () => {
    render(<APIDocsPage />);
    
    // Switch to Redoc first
    const redocButton = screen.getByText('Redoc');
    fireEvent.click(redocButton);

    // Switch back to Swagger
    const swaggerButton = screen.getByText('Swagger UI');
    fireEvent.click(swaggerButton);

    const viewer = screen.getByTestId('docs-viewer');
    expect(viewer).toHaveTextContent('Docs Viewer: swagger');
  });
});

