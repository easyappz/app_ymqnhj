import instance from './axios';

export async function apiStatsSummary(params) {
  const res = await instance.get('/api/stats/summary', { params });
  return res.data?.summary || res.data;
}

export async function apiStatsWeekly(params) {
  const res = await instance.get('/api/stats/weekly', { params });
  return res.data?.items || [];
}

export async function apiStatsMonthly(params) {
  const res = await instance.get('/api/stats/monthly', { params });
  return res.data?.items || [];
}
