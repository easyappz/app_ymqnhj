import instance from './axios';

export async function listRuns(params = {}) {
  const res = await instance.get('/api/runs', { params });
  return res.data; // { items, page, limit, total, hasMore }
}

export async function getRun(id) {
  const res = await instance.get(`/api/runs/${id}`);
  return res.data;
}

export async function createRun(payload) {
  const res = await instance.post('/api/runs', payload);
  return res.data;
}

export async function updateRun(id, payload) {
  const res = await instance.patch(`/api/runs/${id}`, payload);
  return res.data;
}

export async function deleteRun(id) {
  const res = await instance.delete(`/api/runs/${id}`);
  return res.data;
}
