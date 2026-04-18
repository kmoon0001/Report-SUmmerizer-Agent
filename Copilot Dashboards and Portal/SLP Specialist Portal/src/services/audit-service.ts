import { logger } from '../utils/logger';

export const auditService = {
  logInteraction: (data: { prompt: string; confidence: number; feedback?: 'up' | 'down' }) => {
    logger.info('[AUDIT LOG]', { timestamp: new Date().toISOString(), ...data });
    // In a production environment, this would send to a secure backend endpoint
  }
};
