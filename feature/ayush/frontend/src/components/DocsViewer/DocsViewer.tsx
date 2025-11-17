/**
 * CON-12: Documentation Viewer Component
 * Displays Swagger or Redoc documentation
 */

import React, { useEffect, useRef } from 'react';

interface DocsViewerProps {
  mode: 'swagger' | 'redoc';
}

const DocsViewer: React.FC<DocsViewerProps> = ({ mode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const apiUrl = 'http://localhost:3000';

    if (mode === 'swagger') {
      // Load Swagger UI
      containerRef.current.innerHTML = `
        <iframe
          src="${apiUrl}/api-docs/swagger"
          style="width: 100%; height: 800px; border: none;"
          title="Swagger UI"
        ></iframe>
      `;
    } else {
      // Load Redoc
      containerRef.current.innerHTML = `
        <iframe
          src="${apiUrl}/api-docs/redoc"
          style="width: 100%; height: 800px; border: none;"
          title="Redoc"
        ></iframe>
      `;
    }
  }, [mode]);

  return (
    <div className="docs-viewer" style={{ marginTop: '20px' }}>
      <div ref={containerRef} style={{ width: '100%', minHeight: '800px' }} />
    </div>
  );
};

export default DocsViewer;

