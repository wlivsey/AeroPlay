import { LandmarkEvent } from './RouteEngine';

export interface DriftAdjustment {
  departureDelay: number; // minutes late departure
  currentOffset: number;  // minutes ahead/behind schedule
  userAdjustment: number; // manual adjustment by parent
}

export interface FlightProgress {
  scheduledElapsed: number;
  actualElapsed: number;
  estimatedRemaining: number;
  confidence: number; // 0-1 confidence in estimate
}

class DriftManager {
  private startTime: Date | null = null;
  private scheduledDeparture: Date | null = null;
  private scheduledArrival: Date | null = null;
  private manualOffset: number = 0;
  private departureDelay: number = 0;

  initialize(scheduledDep: Date, scheduledArr: Date): void {
    this.scheduledDeparture = scheduledDep;
    this.scheduledArrival = scheduledArr;
    this.startTime = null;
    this.manualOffset = 0;
    this.departureDelay = 0;
  }

  startFlight(actualDepartureTime?: Date): void {
    this.startTime = actualDepartureTime || new Date();

    if (this.scheduledDeparture) {
      this.departureDelay =
        (this.startTime.getTime() - this.scheduledDeparture.getTime()) / 60000;
    }
  }

  adjustTimeline(events: LandmarkEvent[], drift?: DriftAdjustment): LandmarkEvent[] {
    if (!drift) {
      drift = this.getCurrentDrift();
    }

    const totalOffset = drift.departureDelay + drift.currentOffset + drift.userAdjustment;

    // Apply time dilation/compression based on progress
    const adjustmentFactor = this.calculateAdjustmentFactor(drift);

    return events.map(event => ({
      ...event,
      etaMin: (event.etaMin + totalOffset) * adjustmentFactor,
      userAdjusted: drift!.userAdjustment !== 0,
    }));
  }

  private calculateAdjustmentFactor(drift: DriftAdjustment): number {
    // If we're running behind, compress remaining timeline slightly
    // If ahead, expand it slightly
    const factor = 1 + (drift.currentOffset / 200);
    return Math.max(0.8, Math.min(1.2, factor)); // Limit to ±20% adjustment
  }

  getCurrentDrift(): DriftAdjustment {
    return {
      departureDelay: this.departureDelay,
      currentOffset: this.calculateCurrentOffset(),
      userAdjustment: this.manualOffset,
    };
  }

  private calculateCurrentOffset(): number {
    if (!this.startTime || !this.scheduledDeparture || !this.scheduledArrival) {
      return 0;
    }

    const now = new Date();
    const actualElapsed = (now.getTime() - this.startTime.getTime()) / 60000;
    const scheduledElapsed =
      (now.getTime() - this.scheduledDeparture.getTime()) / 60000;

    return actualElapsed - scheduledElapsed;
  }

  applyManualAdjustment(minutes: number): void {
    this.manualOffset = minutes;
  }

  getFlightProgress(): FlightProgress {
    if (!this.startTime || !this.scheduledDeparture || !this.scheduledArrival) {
      return {
        scheduledElapsed: 0,
        actualElapsed: 0,
        estimatedRemaining: 0,
        confidence: 0,
      };
    }

    const now = new Date();
    const actualElapsed = (now.getTime() - this.startTime.getTime()) / 60000;
    const totalScheduled =
      (this.scheduledArrival.getTime() - this.scheduledDeparture.getTime()) / 60000;

    const drift = this.getCurrentDrift();
    const adjustedTotal = totalScheduled * this.calculateAdjustmentFactor(drift);
    const estimatedRemaining = Math.max(0, adjustedTotal - actualElapsed);

    // Calculate confidence based on flight progress
    const progressRatio = actualElapsed / totalScheduled;
    const confidence = Math.min(0.95, 0.3 + (progressRatio * 0.65));

    return {
      scheduledElapsed:
        (now.getTime() - this.scheduledDeparture.getTime()) / 60000,
      actualElapsed,
      estimatedRemaining,
      confidence,
    };
  }

  suggestTimelineAdjustment(
    landmarksPassed: number,
    totalLandmarks: number
  ): number {
    // Suggest adjustment based on landmark progress vs time progress
    const landmarkProgress = landmarksPassed / totalLandmarks;
    const timeProgress = this.getFlightProgress();

    if (timeProgress.confidence < 0.3) {
      return 0; // Too early in flight to suggest adjustments
    }

    const expectedLandmarks =
      Math.floor(totalLandmarks * (timeProgress.actualElapsed /
        (timeProgress.actualElapsed + timeProgress.estimatedRemaining)));

    const difference = landmarksPassed - expectedLandmarks;

    // Suggest adjustment: positive if ahead, negative if behind
    return difference * 2; // Each landmark difference = ~2 minutes adjustment
  }

  reset(): void {
    this.startTime = null;
    this.scheduledDeparture = null;
    this.scheduledArrival = null;
    this.manualOffset = 0;
    this.departureDelay = 0;
  }

  // For parent dashboard
  getStats(): {
    departureDelay: number;
    currentDrift: number;
    manualAdjustment: number;
    estimatedArrival: Date | null;
  } {
    const drift = this.getCurrentDrift();
    const progress = this.getFlightProgress();

    let estimatedArrival = null;
    if (this.startTime) {
      estimatedArrival = new Date(
        this.startTime.getTime() +
        (progress.actualElapsed + progress.estimatedRemaining) * 60000
      );
    }

    return {
      departureDelay: drift.departureDelay,
      currentDrift: drift.currentOffset,
      manualAdjustment: drift.userAdjustment,
      estimatedArrival,
    };
  }
}

export default new DriftManager();