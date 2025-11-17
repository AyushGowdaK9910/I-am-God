/**
 * CON-9: Tests for health check endpoints
 */

import { uptimeMonitor } from '../../health/uptime-monitor';

describe('Health Checks', () => {
  it('should calculate uptime percentage', () => {
    const percentage = uptimeMonitor.getUptimePercentage();
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
  });

  it('should check if target is met (99.5%)', () => {
    const targetMet = uptimeMonitor.isTargetMet();
    expect(typeof targetMet).toBe('boolean');
  });
});

