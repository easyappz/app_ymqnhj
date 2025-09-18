import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import * as goalsApi from '../api/goals';
import { getApiErrorMessage } from '../utils/error';

export function useGoals(params) {
  return useQuery({
    queryKey: ['goals', params],
    queryFn: () => goalsApi.listGoals(params),
    enabled: !!localStorage.getItem('token'),
    keepPreviousData: true,
  });
}

export function useGoal(id) {
  return useQuery({
    queryKey: ['goals', 'detail', id],
    queryFn: () => goalsApi.getGoal(id),
    enabled: !!id && !!localStorage.getItem('token'),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['goals', 'create'],
    mutationFn: (payload) => goalsApi.createGoal(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goals'] });
      message.success('Цель создана');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['goals', 'update'],
    mutationFn: ({ id, payload }) => goalsApi.updateGoal(id, payload),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['goals'] });
      if (v?.id) qc.invalidateQueries({ queryKey: ['goals', 'detail', v.id] });
      message.success('Цель обновлена');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['goals', 'delete'],
    mutationFn: (id) => goalsApi.deleteGoal(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['goals'] });
      message.success('Цель удалена');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}
