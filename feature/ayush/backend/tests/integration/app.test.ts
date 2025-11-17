/**
 * CON-17, CON-7, CON-9: Integration Tests for Complete Application
 */

import request from 'supertest';
import express, { Express } from 'express';
import { setupDocs } from '../../docs/swagger';
import { setupHealthChecks } from '../../health/health-check-controller';

// Create app for testing
const app: Express = express();
app.use(express.json());
setupDocs(app);
setupHealthChecks(app);

app.get('/', (req, res) => {
  res.json({
    message: 'File Conversion Service API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/health',
  });
});

describe('Application Integration Tests', () => {
  describe('Root Endpoint', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('Health Endpoints', () => {
    it('should have /health endpoint', async () => {
      const response = await request(app).get('/health');
      expect([200, 503]).toContain(response.status);
    });

    it('should have /health/ready endpoint', async () => {
      const response = await request(app).get('/health/ready');
      expect([200, 503]).toContain(response.status);
    });

    it('should have /health/live endpoint', async () => {
      const response = await request(app).get('/health/live');
      expect(response.status).toBe(200);
    });
  });

  describe('API Documentation Endpoints', () => {
    it('should have /api-docs endpoint', async () => {
      const response = await request(app).get('/api-docs');
      expect([200, 301, 302]).toContain(response.status);
    });

    it('should have /api-docs/swagger endpoint', async () => {
      const response = await request(app).get('/api-docs/swagger');
      expect([200, 301, 302]).toContain(response.status);
    });

    it('should have /api-docs/redoc endpoint', async () => {
      const response = await request(app).get('/api-docs/redoc');
      expect([200, 301, 302]).toContain(response.status);
    });

    it('should have /api-docs/swagger.json endpoint', async () => {
      const response = await request(app).get('/api-docs/swagger.json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
    });
  });
});

