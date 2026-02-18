/**
 * React Query hooks for patient list and single-patient data.
 * All server state lives in React Query; sync to PatientContext where needed for UI.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPatients, fetchPatientById, updatePatient } from '../services/patientService';

export const patientKeys = {
  all: ['patients'],
  list: () => [...patientKeys.all, 'list'],
  detail: (id) => [...patientKeys.all, 'detail', id],
};

/** Patients list (dashboard). Replace with real API via patientService.fetchPatients. */
export function usePatientsQuery() {
  return useQuery({
    queryKey: patientKeys.list(),
    queryFn: fetchPatients,
  });
}

/** Single patient full data. Replace with real API via patientService.fetchPatientById. */
export function usePatientQuery(patientId, options = {}) {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => fetchPatientById(patientId),
    enabled: !!patientId,
    ...options,
  });
}

/** Create/update patient. Invalidates list + detail so UI refetches. Replace with real API via patientService.updatePatient. */
export function useUpdatePatientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, patientData }) => updatePatient(patientId, patientData),
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.list() });
      if (patientId && patientId !== 'new') {
        queryClient.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
      }
    },
  });
}
