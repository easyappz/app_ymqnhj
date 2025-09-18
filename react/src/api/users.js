import instance from './axios';

export async function getMe() {
  const res = await instance.get('/api/users/me');
  return res.data; // { user }
}

export async function updateMe(payload) {
  const res = await instance.patch('/api/users/me', payload);
  return res.data;
}
