import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import * as runsApi from '../api/runs';
import { getApiErrorMessage } from '../utils/error';

export function useRuns(params) {
  return useQuery({
    queryKey: ['runs', params],
    queryFn: () => runsApi.listRuns(params),
    enabled: !!localStorage.getItem('token'),
    keepPreviousData: true,
  });
}

export function useRun(id) {
  return useQuery({
    queryKey: ['runs', 'detail', id],
    queryFn: () => runsApi.getRun(id),
    enabled: !!id && !!localStorage.getItem('token'),
  });
}

export function useCreateRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['runs', 'create'],
    mutationFn: (payload) => runsApi.createRun(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['runs'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      message.success('Пробежка добавлена');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useUpdateRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['runs', 'update'],
    mutationFn: ({ id, payload }) => runsApi.updateRun(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['runs'] });
      if (variables?.id) qc.invalidateQueries({ queryKey: ['runs', 'detail', variables.id] });
      message.success('Пробежка обновлена');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useDeleteRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['runs', 'delete'],
    mutationFn: (id) => runsApi.deleteRun(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['runs'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      message.success('Пробежка удалена');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}
