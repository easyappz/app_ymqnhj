import instance from './axios';

export async function apiListGoals(params) {
  const res = await instance.get('/api/goals', { params });
  return res.data;
}

export async function apiCreateGoal(payload) {
  const res = await instance.post('/api/goals', payload);
  return res.data;
}

export async function apiUpdateGoal(id, payload) {
  const res = await instance.patch(`/api/goals/${id}`, payload);
  return res.data;
}

export async function apiDeleteGoal(id) {
  const res = await instance.delete(`/api/goals/${id}`);
  return res.data;
}
