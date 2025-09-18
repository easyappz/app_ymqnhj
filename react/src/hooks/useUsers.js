import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiUpdateMe } from '../api/users';

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiUpdateMe,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}
