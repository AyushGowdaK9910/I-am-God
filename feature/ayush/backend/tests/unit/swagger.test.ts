/**
 * CON-7: Tests for Swagger/OpenAPI Documentation
 */

import request from 'supertest';
import express, { Express } from 'express';
import { setupDocs } from '../../docs/swagger';

describe('Swagger Documentation (CON-7)', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    setupDocs(app);
  });

  it('should setup Swagger UI endpoint', async () => {
    const response = await request(app).get('/api-docs/swagger');

    // Swagger UI should be accessible
    expect([200, 301, 302]).toContain(response.status);
  });

  it('should setup Redoc endpoint', async () => {
    const response = await request(app).get('/api-docs/redoc');

    // Redoc should be accessible
    expect([200, 301, 302]).toContain(response.status);
  });

  it('should provide Swagger JSON spec', async () => {
    const response = await request(app).get('/api-docs/swagger.json');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toHaveProperty('openapi');
    expect(response.body.openapi).toBe('3.0.0');
  });

  it('should have correct API info in spec', async () => {
    const response = await request(app).get('/api-docs/swagger.json');

    expect(response.body.info).toBeDefined();
    expect(response.body.info.title).toBe('File Conversion Service API');
    expect(response.body.info.version).toBe('1.0.0');
  });

  it('should redirect root docs to Swagger', async () => {
    const response = await request(app).get('/api-docs');

    // Should redirect to Swagger
    expect([301, 302]).toContain(response.status);
    expect(response.headers.location).toContain('swagger');
  });

  it('should have servers configured', async () => {
    const response = await request(app).get('/api-docs/swagger.json');

    expect(response.body.servers).toBeDefined();
    expect(Array.isArray(response.body.servers)).toBe(true);
    expect(response.body.servers.length).toBeGreaterThan(0);
  });

  it('should have security schemes defined', async () => {
    const response = await request(app).get('/api-docs/swagger.json');

    expect(response.body.components).toBeDefined();
    expect(response.body.components.securitySchemes).toBeDefined();
    expect(response.body.components.securitySchemes.bearerAuth).toBeDefined();
  });
});

