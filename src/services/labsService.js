/**
 * Labs API — create and fetch lab records for a patient.
 * All requests attach the auth token via authFetch.
 */
import { authFetch } from './apiClient';

const PATIENTS_BASE =
  import.meta.env.VITE_PATIENTS_BASE_URL || 'http://localhost:8002';

/**
 * Fetch the latest lab record for a patient.
 * Returns the most recent lab object, or null if none exist.
 */
export async function fetchLatestLab(patientId) {
  if (!patientId || patientId === 'new') return null;
  const res = await authFetch(
    `${PATIENTS_BASE}/patients/${patientId}/labs?limit=1`
  );
  if (!res.ok) throw new Error('Failed to fetch labs');
  const json = await res.json();
  const items = json.data?.items ?? json;
  return Array.isArray(items) && items.length > 0 ? items[0] : null;
}

/**
 * Create a new lab record for a patient.
 * Fields: a1c, fasting_glucose, random_glucose, egfr, uacr, creatinine, ldl, etc.
 * Posting a lab also auto-updates matching fields on the parent Patient.
 */
export async function createLabRecord(patientId, data) {
  const res = await authFetch(
    `${PATIENTS_BASE}/patients/${patientId}/labs`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error('Failed to create lab record');
  return res.json();
}
