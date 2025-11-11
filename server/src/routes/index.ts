import type { Application } from 'express';
import { PrismaClient } from '@prisma/client';

import { API_ROUTES } from '../utils/apiRoutes';
import auth from './authentication';
import test from './test';

const prisma = new PrismaClient();

export function routes(app: Application): void {
  app.get(API_ROUTES.root, (req, res) => {
    res
      .status(200)
      .json({ message: `Routes are active! (route: ${API_ROUTES.root})` });
  });

  app.get('/health', async (_req, res) => {
    const data = {
      status: 'ok',
      uptime: process.uptime(),
      date: new Date(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'unknown',
      },
    };

    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      data.services.database = 'connected';
    } catch {
      data.status = 'not ready';
      data.services.database = 'disconnected';
    }

    // Check if we're ready to serve requests
    const isHealthy = data.services.database === 'connected';

    res.status(isHealthy ? 200 : 503).json(data);
  });

  // Add readiness probe for Docker deployments
  app.get('/ready', async (_req, res) => {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ status: 'ready', database: 'connected' });
    } catch (error) {
      res.status(503).json({
        status: 'not ready',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Define your routes here
  app.use('/', auth);
  app.use('/', test);
}
