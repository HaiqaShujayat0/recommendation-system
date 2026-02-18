/**
 * Audit trail API — fetch log of recommendations and physician actions.
 * Currently uses dummy data; replace with authFetch when backend is ready.
 */

// TODO: Real API — return authFetch(`${API_BASE}/audit`).then(r => r.json());
import { AUDIT_LOGS } from '../data/dummyData';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch audit log entries.
 * TODO: Real API — GET audit endpoint, optional query params (filter, date range, etc.).
 */
export async function fetchAuditLogs() {
  await delay(200);
  return AUDIT_LOGS;
}
