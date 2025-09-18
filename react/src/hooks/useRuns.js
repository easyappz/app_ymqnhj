import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiListRuns, apiCreateRun, apiUpdateRun, apiDeleteRun } from '../api/runs';

export function useRunsList(params) {
  return useQuery({
    queryKey: ['runs', params],
    queryFn: () => apiListRuns(params),
    keepPreviousData: true,
  });
}

export function useCreateRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiCreateRun,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['runs'] });
    },
  });
}

export function useUpdateRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => apiUpdateRun(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['runs'] });
    },
  });
}

export function useDeleteRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiDeleteRun(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['runs'] });
    },
  });
}
