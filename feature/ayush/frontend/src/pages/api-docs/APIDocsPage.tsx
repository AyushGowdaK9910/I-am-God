/**
 * CON-12: API Documentation Page
 * Integrates Swagger and Redoc documentation
 */

import React, { useState } from 'react';
import DocsViewer from '../../components/DocsViewer/DocsViewer';
import HealthStatusWidget from '../../components/health-status-widget/HealthStatusWidget';

const APIDocsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'swagger' | 'redoc'>('swagger');

  return (
    <div className="api-docs-page">
      <h1>API Documentation (CON-12)</h1>
      
      <HealthStatusWidget />

      <div className="docs-controls" style={{ margin: '20px 0' }}>
        <button
          onClick={() => setViewMode('swagger')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: viewMode === 'swagger' ? '#3b82f6' : '#e5e7eb',
            color: viewMode === 'swagger' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Swagger UI
        </button>
        <button
          onClick={() => setViewMode('redoc')}
          style={{
            padding: '10px 20px',
            backgroundColor: viewMode === 'redoc' ? '#3b82f6' : '#e5e7eb',
            color: viewMode === 'redoc' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Redoc
        </button>
      </div>

      <DocsViewer mode={viewMode} />
    </div>
  );
};

export default APIDocsPage;

