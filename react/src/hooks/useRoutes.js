import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import * as routesApi from '../api/routes';
import { getApiErrorMessage } from '../utils/error';

export function useRoutesList(params) {
  return useQuery({
    queryKey: ['routes', params],
    queryFn: () => routesApi.listRoutes(params),
    enabled: !!localStorage.getItem('token'),
    keepPreviousData: true,
  });
}

export function useRoute(id) {
  return useQuery({
    queryKey: ['routes', 'detail', id],
    queryFn: () => routesApi.getRoute(id),
    enabled: !!id && !!localStorage.getItem('token'),
  });
}

export function useCreateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['routes', 'create'],
    mutationFn: (payload) => routesApi.createRoute(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['routes'] });
      message.success('Маршрут создан');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useUpdateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['routes', 'update'],
    mutationFn: ({ id, payload }) => routesApi.updateRoute(id, payload),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['routes'] });
      if (v?.id) qc.invalidateQueries({ queryKey: ['routes', 'detail', v.id] });
      message.success('Маршрут обновлен');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}

export function useDeleteRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['routes', 'delete'],
    mutationFn: (id) => routesApi.deleteRoute(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['routes'] });
      message.success('Маршрут удален');
    },
    onError: (err) => message.error(getApiErrorMessage(err)),
  });
}
