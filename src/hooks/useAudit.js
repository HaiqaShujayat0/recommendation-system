/**
 * React Query hooks for audit trail.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from '../services/auditService';

export const auditKeys = {
  all: ['audit'],
  list: () => [...auditKeys.all, 'list'],
};

/** Audit log entries. Replace with real API via auditService.fetchAuditLogs. */
export function useAuditLogsQuery() {
  return useQuery({
    queryKey: auditKeys.list(),
    queryFn: fetchAuditLogs,
  });
}
