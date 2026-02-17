import { Injectable } from '@nestjs/common';

/**
 * Service to track validation attempts per ruleId
 * In-memory state management for demo purposes
 */
@Injectable()
export class ValidationStateService {
  private attempts: Map<string, number> = new Map();

  /**
   * Get current attempt number for a ruleId and increment it
   */
  getAndIncrementAttempt(ruleId: string): number {
    const currentAttempt = this.attempts.get(ruleId) || 0;
    const nextAttempt = currentAttempt + 1;
    this.attempts.set(ruleId, nextAttempt);
    return nextAttempt;
  }

  /**
   * Get current attempt number without incrementing
   */
  getCurrentAttempt(ruleId: string): number {
    return this.attempts.get(ruleId) || 0;
  }

  /**
   * Reset attempts for a specific ruleId
   */
  resetAttempts(ruleId: string): void {
    this.attempts.delete(ruleId);
  }

  /**
   * Reset all attempts (for testing)
   */
  resetAll(): void {
    this.attempts.clear();
  }

  /**
   * Get all tracked ruleIds with their attempt counts
   */
  getAllAttempts(): Map<string, number> {
    return new Map(this.attempts);
  }
}
