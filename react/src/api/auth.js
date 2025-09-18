import instance from './axios';

export async function register(payload) {
  // payload: { email, password, name?, age?, weight?, height? }
  const res = await instance.post('/api/auth/register', payload);
  const data = res.data;
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export async function login(payload) {
  // payload: { email, password }
  const res = await instance.post('/api/auth/login', payload);
  const data = res.data;
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export function logout() {
  localStorage.removeItem('token');
}
