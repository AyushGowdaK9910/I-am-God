/**
 * CON-9, CON-12: Health Status Widget
 * Displays service health and uptime
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  uptimePercentage: number;
  services: {
    database: 'up' | 'down';
    api: 'up' | 'down';
  };
}

const HealthStatusWidget: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/health');
        setHealth(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch health status', error);
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading health status...</div>;
  }

  if (!health) {
    return <div>Unable to fetch health status</div>;
  }

  const isHealthy = health.status === 'healthy';
  const targetMet = health.uptimePercentage >= 99.5;

  return (
    <div
      className="health-status-widget"
      style={{
        padding: '15px',
        border: `2px solid ${isHealthy ? '#4caf50' : '#f44336'}`,
        borderRadius: '8px',
        backgroundColor: isHealthy ? '#e8f5e9' : '#ffebee',
        marginBottom: '20px',
      }}
    >
      <h2>Service Health Status (CON-9)</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <strong>Status:</strong>{' '}
          <span style={{ color: isHealthy ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
            {health.status.toUpperCase()}
          </span>
        </div>
        <div>
          <strong>Uptime:</strong> {Math.floor(health.uptime / 3600)}h{' '}
          {Math.floor((health.uptime % 3600) / 60)}m
        </div>
        <div>
          <strong>Uptime %:</strong>{' '}
          <span style={{ color: targetMet ? '#4caf50' : '#ff9800', fontWeight: 'bold' }}>
            {health.uptimePercentage}%
          </span>
          {targetMet && ' ✅ Target Met (99.5%)'}
        </div>
        <div>
          <strong>Database:</strong>{' '}
          <span style={{ color: health.services.database === 'up' ? '#4caf50' : '#f44336' }}>
            {health.services.database.toUpperCase()}
          </span>
        </div>
        <div>
          <strong>API:</strong>{' '}
          <span style={{ color: health.services.api === 'up' ? '#4caf50' : '#f44336' }}>
            {health.services.api.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HealthStatusWidget;

