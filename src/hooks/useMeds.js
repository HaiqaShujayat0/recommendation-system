/**
 * React Query hooks for patient medication records.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMeds, createMed, updateMed, deleteMed } from '../services/medsService';

export const medsKeys = {
  all: ['meds'],
  list: (patientId) => [...medsKeys.all, 'list', patientId],
};

/**
 * Fetch all medications for a patient.
 * Disabled for new patients.
 */
export function useMedsQuery(patientId, options = {}) {
  return useQuery({
    queryKey: medsKeys.list(patientId),
    queryFn: () => fetchMeds(patientId),
    enabled: !!patientId && patientId !== 'new',
    ...options,
  });
}

/**
 * Create a new medication (POST /patients/{id}/meds).
 * Call with: mutate({ patientId, data: { name, dose, frequency, active } })
 */
export function useCreateMedMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, data }) => createMed(patientId, data),
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: medsKeys.list(patientId) });
    },
  });
}

/**
 * Update an existing medication (PUT /patients/{id}/meds/{medId}).
 * Call with: mutateAsync({ patientId, medId, data })
 */
export function useUpdateMedMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, medId, data }) => updateMed(patientId, medId, data),
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: medsKeys.list(patientId) });
    },
  });
}

/**
 * Delete a medication (DELETE /patients/{id}/meds/{medId}).
 * Call with: mutateAsync({ patientId, medId })
 */
export function useDeleteMedMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, medId }) => deleteMed(patientId, medId),
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: medsKeys.list(patientId) });
    },
  });
}
