/**
 * CON-12: Tests for Documentation Viewer Component
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocsViewer from '../components/DocsViewer/DocsViewer';

describe('DocsViewer (CON-12)', () => {
  it('should render the component', () => {
    const { container } = render(<DocsViewer mode="swagger" />);
    expect(container).toBeInTheDocument();
  });

  it('should render Swagger iframe when mode is swagger', () => {
    const { container } = render(<DocsViewer mode="swagger" />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe?.getAttribute('src')).toContain('/api-docs/swagger');
  });

  it('should render Redoc iframe when mode is redoc', () => {
    const { container } = render(<DocsViewer mode="redoc" />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe?.getAttribute('src')).toContain('/api-docs/redoc');
  });

  it('should update iframe src when mode changes', () => {
    const { container, rerender } = render(<DocsViewer mode="swagger" />);
    let iframe = container.querySelector('iframe');
    expect(iframe?.getAttribute('src')).toContain('/api-docs/swagger');

    rerender(<DocsViewer mode="redoc" />);
    iframe = container.querySelector('iframe');
    expect(iframe?.getAttribute('src')).toContain('/api-docs/redoc');
  });

  it('should have correct iframe attributes', () => {
    const { container } = render(<DocsViewer mode="swagger" />);
    const iframe = container.querySelector('iframe');
    
    expect(iframe?.getAttribute('title')).toBe('Swagger UI');
    expect(iframe?.getAttribute('style')).toContain('width: 100%');
    expect(iframe?.getAttribute('style')).toContain('height: 800px');
  });
});

