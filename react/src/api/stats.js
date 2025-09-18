import instance from './axios';

export async function getSummary(params = {}) {
  const res = await instance.get('/api/stats/summary', { params });
  return res.data; // { summary: {...} }
}

export async function getWeekly(params = {}) {
  const res = await instance.get('/api/stats/weekly', { params });
  return res.data; // { items: [...] }
}

export async function getMonthly(params = {}) {
  const res = await instance.get('/api/stats/monthly', { params });
  return res.data; // { items: [...] }
}
