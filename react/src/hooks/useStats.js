import { useQuery } from '@tanstack/react-query';
import { apiStatsMonthly, apiStatsSummary, apiStatsWeekly } from '../api/stats';

export function useStatsSummary(params) {
  return useQuery({ queryKey: ['stats-summary', params], queryFn: () => apiStatsSummary(params) });
}

export function useStatsWeekly(params) {
  return useQuery({ queryKey: ['stats-weekly', params], queryFn: () => apiStatsWeekly(params) });
}

export function useStatsMonthly(params) {
  return useQuery({ queryKey: ['stats-monthly', params], queryFn: () => apiStatsMonthly(params) });
}
