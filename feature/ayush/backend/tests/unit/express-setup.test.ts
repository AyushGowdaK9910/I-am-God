/**
 * CON-17: Tests for Express Setup
 */

import request from 'supertest';
import { setupExpress } from '../../base-setup/src/express-setup';

describe('Express Setup (CON-17)', () => {
  it('should create an Express app', () => {
    const app = setupExpress();
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });

  it('should have CORS middleware configured', async () => {
    const app = setupExpress();
    app.get('/test', (req, res) => {
      res.json({ message: 'test' });
    });

    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://localhost:5173');

    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });

  it('should have Helmet security middleware', async () => {
    const app = setupExpress();
    app.get('/test', (req, res) => {
      res.json({ message: 'test' });
    });

    const response = await request(app).get('/test');

    // Helmet adds security headers
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should parse JSON body', async () => {
    const app = setupExpress();
    app.post('/test', (req, res) => {
      res.json({ received: req.body });
    });

    const response = await request(app)
      .post('/test')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.received).toEqual({ test: 'data' });
  });
});

