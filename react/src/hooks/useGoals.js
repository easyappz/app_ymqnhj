import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiCreateGoal, apiDeleteGoal, apiListGoals, apiUpdateGoal } from '../api/goals';

export function useGoalsList(params) {
  return useQuery({
    queryKey: ['goals', params],
    queryFn: () => apiListGoals(params),
    keepPreviousData: true,
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiCreateGoal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => apiUpdateGoal(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiDeleteGoal(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}
