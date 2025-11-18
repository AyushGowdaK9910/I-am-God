import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// CON-7: Backend API Documentation (Swagger/Redoc)
// This frontend is minimal - API docs are served by backend
const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>API Documentation</h1>
      <p>API documentation is available at:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><a href="/api-docs/swagger">Swagger UI</a></li>
        <li><a href="/api-docs/redoc">Redoc</a></li>
      </ul>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
