/**
 * CON-9: Tests for Uptime Monitor
 */

import { uptimeMonitor } from '../../health/uptime-monitor';

describe('Uptime Monitor (CON-9)', () => {
  beforeEach(() => {
    // Reset monitor state if needed
    jest.clearAllMocks();
  });

  describe('getUptimePercentage', () => {
    it('should return a percentage between 0 and 100', () => {
      const percentage = uptimeMonitor.getUptimePercentage();
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });

    it('should return a number', () => {
      const percentage = uptimeMonitor.getUptimePercentage();
      expect(typeof percentage).toBe('number');
    });

    it('should round to 2 decimal places', () => {
      const percentage = uptimeMonitor.getUptimePercentage();
      const decimalPlaces = (percentage.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  describe('getUptime', () => {
    it('should return uptime in seconds', () => {
      const uptime = uptimeMonitor.getUptime();
      expect(typeof uptime).toBe('number');
      expect(uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return process uptime', () => {
      const uptime = uptimeMonitor.getUptime();
      const processUptime = process.uptime();
      // Allow small timing differences due to execution time
      expect(Math.abs(uptime - processUptime)).toBeLessThan(0.1);
    });
  });

  describe('isTargetMet', () => {
    it('should return boolean', () => {
      const targetMet = uptimeMonitor.isTargetMet();
      expect(typeof targetMet).toBe('boolean');
    });

    it('should return true when uptime >= 99.5%', () => {
      // Mock high uptime percentage
      jest.spyOn(uptimeMonitor, 'getUptimePercentage').mockReturnValue(99.5);
      expect(uptimeMonitor.isTargetMet()).toBe(true);
    });

    it('should return false when uptime < 99.5%', () => {
      // Mock low uptime percentage
      jest.spyOn(uptimeMonitor, 'getUptimePercentage').mockReturnValue(95.0);
      expect(uptimeMonitor.isTargetMet()).toBe(false);
    });
  });

  describe('recordDowntime', () => {
    it('should record downtime events', () => {
      const startTime = Date.now();
      const endTime = startTime + 1000;

      uptimeMonitor.recordDowntime(startTime, endTime);

      const stats = uptimeMonitor.getStats();
      expect(stats.downtimeEvents).toBeGreaterThan(0);
    });

    it('should handle downtime without end time', () => {
      const startTime = Date.now();

      uptimeMonitor.recordDowntime(startTime);

      const stats = uptimeMonitor.getStats();
      expect(stats.downtimeEvents).toBeGreaterThan(0);
    });
  });

  describe('getStats', () => {
    it('should return uptime statistics', () => {
      const stats = uptimeMonitor.getStats();

      expect(stats).toHaveProperty('startTime');
      expect(stats).toHaveProperty('currentUptime');
      expect(stats).toHaveProperty('uptimePercentage');
      expect(stats).toHaveProperty('targetMet');
      expect(stats).toHaveProperty('downtimeEvents');
    });

    it('should have correct data types', () => {
      const stats = uptimeMonitor.getStats();

      expect(typeof stats.startTime).toBe('number');
      expect(typeof stats.currentUptime).toBe('number');
      expect(typeof stats.uptimePercentage).toBe('number');
      expect(typeof stats.targetMet).toBe('boolean');
      expect(typeof stats.downtimeEvents).toBe('number');
    });
  });
});

