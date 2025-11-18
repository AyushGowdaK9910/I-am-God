/**
 * CON-9: Tests for Health Check Controller
 */

import request from 'supertest';
import express, { Express } from 'express';
import { setupHealthChecks, healthCheck } from '../../health/health-check-controller';
import { uptimeMonitor } from '../../health/uptime-monitor';

describe('Health Check Controller (CON-9)', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    setupHealthChecks(app);
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('uptimePercentage');
    });

    it('should return healthy status when uptime >= 99.5%', () => {
      const mockReq = {} as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      // Mock uptime monitor to return high percentage
      jest.spyOn(uptimeMonitor, 'getUptimePercentage').mockReturnValue(99.5);

      healthCheck(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'healthy',
        })
      );
    });

    it('should return unhealthy status when uptime < 99.5%', () => {
      const mockReq = {} as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      // Mock uptime monitor to return low percentage
      jest.spyOn(uptimeMonitor, 'getUptimePercentage').mockReturnValue(95.0);

      healthCheck(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(503);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'unhealthy',
        })
      );
    });

    it('should return 200 status code when healthy (exactly 99.5%)', () => {
      const mockReq = {} as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(uptimeMonitor, 'getUptimePercentage').mockReturnValue(99.5);

      healthCheck(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 503 status code when unhealthy (below 99.5%)', () => {
      const mockReq = {} as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(uptimeMonitor, 'getUptimePercentage').mockReturnValue(99.4);

      healthCheck(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(503);
    });

    it('should return unhealthy status when uptime is exactly 99.4%', () => {
      const mockReq = {} as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(uptimeMonitor, 'getUptimePercentage').mockReturnValue(99.4);

      healthCheck(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(503);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'unhealthy',
        })
      );
    });

    it('should return healthy status when uptime is exactly 99.5%', () => {
      const mockReq = {} as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(uptimeMonitor, 'getUptimePercentage').mockReturnValue(99.5);

      healthCheck(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'healthy',
        })
      );
    });

    it('should return healthy status when uptime is above 99.5%', () => {
      const mockReq = {} as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest.spyOn(uptimeMonitor, 'getUptimePercentage').mockReturnValue(99.9);

      healthCheck(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'healthy',
        })
      );
    });

    it('should include services status', async () => {
      const response = await request(app).get('/health');

      expect(response.body).toHaveProperty('services');
      expect(response.body.services).toHaveProperty('database');
      expect(response.body.services).toHaveProperty('api');
    });

    it('should include version information', async () => {
      const response = await request(app).get('/health');

      expect(response.body).toHaveProperty('version');
      expect(response.body.version).toBe('1.0.0');
    });
  });

  describe('readinessCheck', () => {
    it('should return ready status', async () => {
      const response = await request(app).get('/health/ready');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ready');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return ready status when isReady is true', async () => {
      const response = await request(app).get('/health/ready');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ready');
    });

    it('should return 200 status code for ready state', async () => {
      const response = await request(app).get('/health/ready');
      expect(response.status).toBe(200);
    });

    it('should include timestamp in ready response', async () => {
      const response = await request(app).get('/health/ready');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.timestamp).toBe('string');
    });
  });

  describe('livenessCheck', () => {
    it('should return alive status', async () => {
      const response = await request(app).get('/health/live');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('alive');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('setupHealthChecks', () => {
    it('should register all health check routes', async () => {
      const healthResponse = await request(app).get('/health');
      const readyResponse = await request(app).get('/health/ready');
      const liveResponse = await request(app).get('/health/live');

      expect(healthResponse.status).toBeGreaterThanOrEqual(200);
      expect(readyResponse.status).toBe(200);
      expect(liveResponse.status).toBe(200);
    });
  });
});

