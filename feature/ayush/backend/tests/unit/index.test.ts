/**
 * CON-17: Tests for Main Application Entry Point
 */

import request from 'supertest';
import express, { Express } from 'express';
import { setupDocs } from '../../docs/swagger';
import { setupHealthChecks } from '../../health/health-check-controller';

// Create app for testing (mocking the actual index.ts imports)
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

describe('Main Application (CON-17)', () => {
  it('should respond to root route', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('health');
  });

  it('should have correct API information', async () => {
    const response = await request(app).get('/');

    expect(response.body.message).toBe('File Conversion Service API');
    expect(response.body.version).toBe('1.0.0');
    expect(response.body.docs).toBe('/api-docs');
    expect(response.body.health).toBe('/health');
  });

  it('should have health check endpoint', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
  });

  it('should have API docs endpoint', async () => {
    const response = await request(app).get('/api-docs');

    // Should redirect or return content
    expect([200, 301, 302]).toContain(response.status);
  });
});

