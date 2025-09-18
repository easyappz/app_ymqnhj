import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import * as authApi from '../api/auth';
import * as usersApi from '../api/users';
import { getApiErrorMessage } from '../utils/error';

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (data) => {
      qc.setQueryData(['me'], data?.user || null);
      message.success('Вход выполнен');
    },
    onError: (err) => {
      message.error(getApiErrorMessage(err));
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: (payload) => authApi.register(payload),
    onSuccess: (data) => {
      qc.setQueryData(['me'], data?.user || null);
      message.success('Регистрация успешна');
    },
    onError: (err) => {
      message.error(getApiErrorMessage(err));
    },
  });
}

export function useMe() {
  const hasToken = !!localStorage.getItem('token');
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await usersApi.getMe();
      return res?.user || null;
    },
    enabled: hasToken,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}
