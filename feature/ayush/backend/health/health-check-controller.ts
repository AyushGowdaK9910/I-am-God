/**
 * CON-9: Health Check Controller
 * Provides health, readiness, and liveness endpoints for high availability
 */

import { Express, Request, Response } from 'express';
import { uptimeMonitor } from './uptime-monitor';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  uptimePercentage: number;
  services: {
    database: 'up' | 'down';
    api: 'up' | 'down';
  };
  version: string;
}

/**
 * Health check endpoint (CON-9)
 */
export const healthCheck = (req: Request, res: Response): void => {
  const uptime = process.uptime();
  const uptimePercentage = uptimeMonitor.getUptimePercentage();

  const healthStatus: HealthStatus = {
    status: uptimePercentage >= 99.5 ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime,
    uptimePercentage,
    services: {
      database: 'up', // TODO: Add actual database check
      api: 'up',
    },
    version: '1.0.0',
  };

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
};

/**
 * Readiness probe (CON-9)
 */
export const readinessCheck = (req: Request, res: Response): void => {
  // Check if service is ready to accept traffic
  const isReady = true; // TODO: Add actual readiness checks

  if (isReady) {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Liveness probe (CON-9)
 */
export const livenessCheck = (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Setup health check routes (CON-9)
 */
export const setupHealthChecks = (app: Express): void => {
  app.get('/health', healthCheck);
  app.get('/health/ready', readinessCheck);
  app.get('/health/live', livenessCheck);
};

