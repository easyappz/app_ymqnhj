import instance from './axios';

export async function apiUpdateMe(payload) {
  const res = await instance.patch('/api/users/me', payload);
  return res.data;
}
