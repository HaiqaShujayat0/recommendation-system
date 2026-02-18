/**
 * AI Recommendations API — generate recommendations for a patient.
 * Currently uses dummy data; replace with authFetch when backend is ready.
 */

// TODO: Real API — use authFetch and rules/recommend endpoint, e.g. authFetch(`${RULES_URL}/recommend`, { method: 'POST', body: JSON.stringify({ patientId, patientData }) });
import { SAMPLE_RECOMMENDATIONS } from '../data/dummyData';

/** Simulated delay for "AI" generation (remove when using real API) */
const delay = (ms = 1800) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch existing recommendations for a patient (e.g. after generate).
 * TODO: Real API — GET `${API_BASE}/patients/${patientId}/recommendations` and return list.
 */
export async function fetchRecommendations(patientId) {
  await delay(100);
  return []; // Dummy: server has no state; list is filled by generateRecommendations + setQueryData
}

/**
 * Generate AI recommendations for a patient given their profile.
 * TODO: Real API — POST to recommend endpoint with patientId and patientData; return list of recommendations.
 */
export async function generateRecommendations(patientId, patientData) {
  await delay(1800);
  // Dummy: ignore patientData and return sample list
  return SAMPLE_RECOMMENDATIONS;
}
