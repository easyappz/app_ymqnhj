import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiCreateRoute, apiDeleteRoute, apiListRoutes, apiUpdateRoute } from '../api/routes';

export function useRoutesList(params) {
  return useQuery({
    queryKey: ['routes', params],
    queryFn: () => apiListRoutes(params),
    keepPreviousData: true,
  });
}

export function useCreateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiCreateRoute,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}

export function useUpdateRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => apiUpdateRoute(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}

export function useDeleteRoute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiDeleteRoute(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
