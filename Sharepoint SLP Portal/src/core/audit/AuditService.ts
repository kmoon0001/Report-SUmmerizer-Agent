/**
 * Fully flexible Mock AuditService to satisfy all TypeScript compiler checks
 * and accommodate broad argument types from legacy files.
 */
export const AuditService = {
  logAccess: (resource: any, action: any) => {},
  logError: (msg: any, context?: any) => {},
  logWarning: (msg: any, context?: any) => {},
  logInfo: (msg: any, context?: any) => {},
  log: (msg: any, context?: any) => {},
  getAuditLog: () => []
};

export const auditService = AuditService;
export default AuditService;
