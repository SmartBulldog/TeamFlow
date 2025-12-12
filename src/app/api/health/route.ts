import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Health Check Endpoint
 * 
 * Provides comprehensive health status of the application
 * including database connectivity and system information.
 * 
 * @returns JSON response with health status
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: 'connected',
        responseTime: `${responseTime}ms`
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      }
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}
