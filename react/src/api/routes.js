import instance from './axios';

export async function listRoutes(params = {}) {
  const res = await instance.get('/api/routes', { params });
  return res.data;
}

export async function getRoute(id) {
  const res = await instance.get(`/api/routes/${id}`);
  return res.data;
}

export async function createRoute(payload) {
  const res = await instance.post('/api/routes', payload);
  return res.data;
}

export async function updateRoute(id, payload) {
  const res = await instance.patch(`/api/routes/${id}`, payload);
  return res.data;
}

export async function deleteRoute(id) {
  const res = await instance.delete(`/api/routes/${id}`);
  return res.data;
}
