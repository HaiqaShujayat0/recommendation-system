/**
 * React Query hooks for AI recommendations.
 * Generate = mutation; list = query (populated by mutation or fetch when API exists).
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRecommendations, generateRecommendations } from '../services/recommendationService';

export const recommendationKeys = {
  all: ['recommendations'],
  list: (patientId) => [...recommendationKeys.all, patientId],
};

/** Recommendations for a patient. Dummy fetch returns []; after Generate, mutation sets cache. TODO: Real API — queryFn fetches stored recommendations. */
export function useRecommendationsQuery(patientId) {
  return useQuery({
    queryKey: recommendationKeys.list(patientId),
    queryFn: () => fetchRecommendations(patientId),
    enabled: !!patientId,
  });
}

/** Generate recommendations for a patient. Writes result into recommendation query cache. Replace with real API via recommendationService. */
export function useGenerateRecommendationsMutation(patientId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientData }) => generateRecommendations(patientId, patientData),
    onSuccess: (data) => {
      queryClient.setQueryData(recommendationKeys.list(patientId), data);
    },
  });
}
