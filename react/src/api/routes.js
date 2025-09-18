import instance from './axios';

export async function apiListRoutes(params) {
  const res = await instance.get('/api/routes', { params });
  return res.data;
}

export async function apiCreateRoute(payload) {
  const res = await instance.post('/api/routes', payload);
  return res.data;
}

export async function apiUpdateRoute(id, payload) {
  const res = await instance.patch(`/api/routes/${id}`, payload);
  return res.data;
}

export async function apiDeleteRoute(id) {
  const res = await instance.delete(`/api/routes/${id}`);
  return res.data;
}
