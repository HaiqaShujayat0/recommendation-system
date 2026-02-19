/**
 * Medications API — CRUD for patient medication records.
 * All requests attach the auth token via authFetch.
 */
import { authFetch } from './apiClient';

const PATIENTS_BASE =
  import.meta.env.VITE_PATIENTS_BASE_URL || 'http://localhost:8002';

/**
 * Fetch all medications for a patient.
 * Returns an array of med objects.
 */
export async function fetchMeds(patientId) {
  if (!patientId || patientId === 'new') return [];
  const res = await authFetch(
    `${PATIENTS_BASE}/patients/${patientId}/meds`
  );
  if (!res.ok) throw new Error('Failed to fetch medications');
  const json = await res.json();
  return json.data?.items ?? json.data ?? json;
}

/**
 * Create a new medication record.
 * Required: name. Optional: dose, frequency, route, active, start_date, notes.
 */
export async function createMed(patientId, data) {
  const res = await authFetch(
    `${PATIENTS_BASE}/patients/${patientId}/meds`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error('Failed to create medication');
  return res.json();
}

/**
 * Update an existing medication record (partial update).
 */
export async function updateMed(patientId, medId, data) {
  const res = await authFetch(
    `${PATIENTS_BASE}/patients/${patientId}/meds/${medId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error('Failed to update medication');
  return res.json();
}

/**
 * Delete a medication record.
 */
export async function deleteMed(patientId, medId) {
  const res = await authFetch(
    `${PATIENTS_BASE}/patients/${patientId}/meds/${medId}`,
    { method: 'DELETE' }
  );
  if (!res.ok) throw new Error('Failed to delete medication');
  return res.json().catch(() => ({ success: true }));
}
