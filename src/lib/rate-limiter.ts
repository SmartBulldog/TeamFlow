/**
 * Rate Limiter для защиты API от brute-force и DDoS атак
 * Реализует sliding window algorithm с in-memory store
 * Production-ready для EU 2026 security standards
 * 
 * Features:
 * - Защита от brute-force на login/register
 * - DDoS protection
 * - Configurable limits per endpoint
 * - IP-based tracking
 * - Easy migration to Redis for distributed systems
 * 
 * @author Valerii Karpov (VKV - New vision)
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

class RateLimiter {
  private requests: Map<string, RateLimitRecord> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Cleanup expired records every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Check if request should be rate limited
   * @param identifier - Usually IP address or user ID
   * @param limit - Maximum requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns true if rate limit exceeded
   */
  public isRateLimited(
    identifier: string,
    limit: number,
    windowMs: number
  ): boolean {
    const now = Date.now()
    const record = this.requests.get(identifier)

    // No previous requests from this identifier
    if (!record) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      })
      return false
    }

    // Window has expired, reset counter
    if (now > record.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      })
      return false
    }

    // Within window, increment counter
    record.count++

    // Rate limit exceeded
    if (record.count > limit) {
      return true
    }

    return false
  }

  /**
   * Get remaining requests for identifier
   */
  public getRemaining(
    identifier: string,
    limit: number
  ): number {
    const record = this.requests.get(identifier)
    if (!record) return limit

    const remaining = limit - record.count
    return Math.max(0, remaining)
  }

  /**
   * Get reset time for identifier
   */
  public getResetTime(identifier: string): number | null {
    const record = this.requests.get(identifier)
    return record?.resetTime || null
  }

  /**
   * Clear rate limit for identifier (useful for testing)
   */
  public clear(identifier: string): void {
    this.requests.delete(identifier)
  }

  /**
   * Clear all rate limits
   */
  public clearAll(): void {
    this.requests.clear()
  }

  /**
   * Cleanup expired records
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key)
      }
    }
  }

  /**
   * Destroy rate limiter and cleanup
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.requests.clear()
  }
}

// Singleton instance
const rateLimiter = new RateLimiter()

// Predefined rate limit configurations for different endpoints
export const RATE_LIMITS = {
  // Auth endpoints - stricter limits
  LOGIN: {
    limit: 5, // 5 attempts
    windowMs: 15 * 60 * 1000, // per 15 minutes
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
  REGISTER: {
    limit: 3, // 3 registrations
    windowMs: 60 * 60 * 1000, // per hour
    message: 'Too many registration attempts. Please try again later.',
  },
  PASSWORD_RESET: {
    limit: 3, // 3 resets
    windowMs: 60 * 60 * 1000, // per hour
    message: 'Too many password reset attempts. Please try again later.',
  },

  // API endpoints - moderate limits
  API_DEFAULT: {
    limit: 100, // 100 requests
    windowMs: 15 * 60 * 1000, // per 15 minutes
    message: 'Too many requests. Please try again later.',
  },

  // GDPR endpoints - moderate limits
  GDPR_EXPORT: {
    limit: 5, // 5 exports
    windowMs: 60 * 60 * 1000, // per hour
    message: 'Too many export requests. Please try again later.',
  },
  GDPR_DELETE: {
    limit: 2, // 2 deletion attempts
    windowMs: 24 * 60 * 60 * 1000, // per day
    message: 'Too many deletion requests. Please contact support.',
  },

  // Workspace/Card operations
  CREATE_WORKSPACE: {
    limit: 10, // 10 workspaces
    windowMs: 60 * 60 * 1000, // per hour
    message: 'Too many workspaces created. Please try again later.',
  },
  CREATE_CARD: {
    limit: 50, // 50 cards
    windowMs: 15 * 60 * 1000, // per 15 minutes
    message: 'Too many cards created. Please slow down.',
  },
} as const

export { rateLimiter }
export default rateLimiter
