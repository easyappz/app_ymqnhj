import instance from './axios';

export async function listGoals(params = {}) {
  const res = await instance.get('/api/goals', { params });
  return res.data;
}

export async function getGoal(id) {
  const res = await instance.get(`/api/goals/${id}`);
  return res.data;
}

export async function createGoal(payload) {
  const res = await instance.post('/api/goals', payload);
  return res.data;
}

export async function updateGoal(id, payload) {
  const res = await instance.patch(`/api/goals/${id}`, payload);
  return res.data;
}

export async function deleteGoal(id) {
  const res = await instance.delete(`/api/goals/${id}`);
  return res.data;
}
