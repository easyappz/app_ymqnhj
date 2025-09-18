import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import * as usersApi from '../api/users';
import { getApiErrorMessage } from '../utils/error';

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['me', 'update'],
    mutationFn: (payload) => usersApi.updateMe(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      message.success('Профиль обновлен');
    },
    onError: (err) => {
      message.error(getApiErrorMessage(err));
    },
  });
}
