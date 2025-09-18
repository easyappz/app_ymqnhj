import { useQuery } from '@tanstack/react-query';
import * as statsApi from '../api/stats';

export function useStatsSummary(params) {
  return useQuery({
    queryKey: ['stats', 'summary', params],
    queryFn: () => statsApi.getSummary(params),
    enabled: !!localStorage.getItem('token'),
    staleTime: 1000 * 60,
  });
}

export function useStatsWeekly(params) {
  return useQuery({
    queryKey: ['stats', 'weekly', params],
    queryFn: () => statsApi.getWeekly(params),
    enabled: !!localStorage.getItem('token'),
    staleTime: 1000 * 60,
  });
}

export function useStatsMonthly(params) {
  return useQuery({
    queryKey: ['stats', 'monthly', params],
    queryFn: () => statsApi.getMonthly(params),
    enabled: !!localStorage.getItem('token'),
    staleTime: 1000 * 60,
  });
}
