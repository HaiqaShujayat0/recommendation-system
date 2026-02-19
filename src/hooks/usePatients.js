/**
 * React Query hooks for patient list and single-patient data.
 * All server state lives in React Query; sync to PatientContext where needed for UI.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPatients, fetchPatientById, createPatient, updatePatient } from '../services/patientService';

export const patientKeys = {
  all: ['patients'],
  list: () => [...patientKeys.all, 'list'],
  detail: (id) => [...patientKeys.all, 'detail', id],
};

/** Patients list (dashboard). */
export function usePatientsQuery(filters = {}) {
  return useQuery({
    queryKey: [...patientKeys.list(), filters],
    queryFn: () => fetchPatients(filters),
  });
}

/** Single patient full data. */
export function usePatientQuery(patientId, options = {}) {
  return useQuery({
    queryKey: patientKeys.detail(patientId),
    queryFn: () => fetchPatientById(patientId),
    enabled: !!patientId && patientId !== 'new',
    ...options,
  });
}

/**
 * Create a new patient (POST /patients).
 * onSuccess receives the full patient object with the real UUID.
 */
export function useCreatePatientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.list() });
    },
  });
}

/**
 * Update specific fields on an existing patient (PUT /patients/{id}).
 * Call with: mutate({ patientId, data: { field: value, ... } })
 */
export function useUpdatePatientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, data }) => updatePatient(patientId, data),
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.list() });
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}
