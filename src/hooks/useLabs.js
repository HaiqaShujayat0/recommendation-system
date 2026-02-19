/**
 * React Query hooks for patient lab records.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLatestLab, createLabRecord } from '../services/labsService';

export const labsKeys = {
  all: ['labs'],
  list: (patientId) => [...labsKeys.all, 'list', patientId],
};

/**
 * Fetch the latest lab record for a patient.
 * Disabled for new patients (patientId === 'new' or falsy).
 */
export function useLatestLabsQuery(patientId, options = {}) {
  return useQuery({
    queryKey: labsKeys.list(patientId),
    queryFn: () => fetchLatestLab(patientId),
    enabled: !!patientId && patientId !== 'new',
    ...options,
  });
}

/**
 * Create a new lab record (POST /patients/{id}/labs).
 * Call with: mutate({ patientId, data: { a1c, egfr, ... } })
 */
export function useCreateLabMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, data }) => createLabRecord(patientId, data),
    onSuccess: (_, { patientId }) => {
      queryClient.invalidateQueries({ queryKey: labsKeys.list(patientId) });
    },
  });
}
