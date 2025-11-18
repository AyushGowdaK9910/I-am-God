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
    
    // Handle edge case where totalTime is 0 or very small
    if (totalTime <= 0) {
      return 100; // If no time has passed, consider it 100% uptime
    }
    
    let totalDowntime = 0;

    for (const event of this.downtimeEvents) {
      const end = event.end || Date.now();
      // Only count downtime that occurs within the monitoring period
      const eventStart = Math.max(event.start, this.startTime);
      const eventEnd = Math.min(end, Date.now());
      
      if (eventEnd > eventStart) {
        totalDowntime += eventEnd - eventStart;
      }
    }

    const uptime = Math.max(0, totalTime - totalDowntime); // Ensure uptime is never negative
    const percentage = (uptime / totalTime) * 100;

    // Clamp percentage between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    return Math.round(clampedPercentage * 100) / 100; // Round to 2 decimal places
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

