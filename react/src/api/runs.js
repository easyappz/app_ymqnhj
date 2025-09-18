import instance from './axios';

export async function apiListRuns(params) {
  const res = await instance.get('/api/runs', { params });
  return res.data;
}

export async function apiCreateRun(payload) {
  const res = await instance.post('/api/runs', payload);
  return res.data;
}

export async function apiUpdateRun(id, payload) {
  const res = await instance.patch(`/api/runs/${id}`, payload);
  return res.data;
}

export async function apiDeleteRun(id) {
  const res = await instance.delete(`/api/runs/${id}`);
  return res.data;
}
