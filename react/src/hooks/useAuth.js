import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGetMe, apiLogin, apiRegister } from '../api/auth';

export function useMe() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return useQuery({
    queryKey: ['me'],
    queryFn: apiGetMe,
    enabled: !!token,
    retry: 0,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiRegister,
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}
