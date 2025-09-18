import instance from './axios';

export async function apiRegister(payload) {
  const res = await instance.post('/api/auth/register', payload);
  return res.data; // { user, token }
}

export async function apiLogin(payload) {
  const res = await instance.post('/api/auth/login', payload);
  return res.data; // { user, token }
}

export async function apiGetMe() {
  const res = await instance.get('/api/users/me');
  return res.data?.user;
}
