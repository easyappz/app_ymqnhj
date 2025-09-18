export function getApiErrorMessage(error) {
  const backendMsg = error?.response?.data?.error?.message;
  const axiosMsg = error?.message;
  if (backendMsg) return backendMsg;
  if (axiosMsg) return axiosMsg;
  return 'Произошла ошибка. Повторите попытку.';
}
