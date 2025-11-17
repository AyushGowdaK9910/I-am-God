/**
 * CON-9: Uptime Monitor
 * Tracks service uptime for 99.5% availability target
 */

class UptimeMonitor {
  private startTime: number;
  private downtimeEvents: Array<{ start: number; end?: number }> = [];

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Record downtime event
   */
  recordDowntime(start: number, end?: number): void {
    this.downtimeEvents.push({ start, end });
  }

  /**
   * Calculate uptime percentage (CON-9: 99.5% target)
   */
  getUptimePercentage(): number {
    const totalTime = Date.now() - this.startTime;
    let totalDowntime = 0;

    for (const event of this.downtimeEvents) {
      const end = event.end || Date.now();
      totalDowntime += end - event.start;
    }

    const uptime = totalTime - totalDowntime;
    const percentage = (uptime / totalTime) * 100;

    return Math.round(percentage * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get current uptime in seconds
   */
  getUptime(): number {
    return process.uptime();
  }

  /**
   * Check if uptime target is met (99.5%)
   */
  isTargetMet(): boolean {
    return this.getUptimePercentage() >= 99.5;
  }

  /**
   * Get uptime statistics
   */
  getStats() {
    return {
      startTime: this.startTime,
      currentUptime: this.getUptime(),
      uptimePercentage: this.getUptimePercentage(),
      targetMet: this.isTargetMet(),
      downtimeEvents: this.downtimeEvents.length,
    };
  }
}

export const uptimeMonitor = new UptimeMonitor();

