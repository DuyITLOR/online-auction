async function api<T>(
  endpoint: string,
  { method = 'GET', data }: { method?: string; data?: unknown } = {}
): Promise<T> {
  const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`;
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json();
    return Promise.reject(new Error(errorData.message || 'API request failed'));
  }

  const result = await response.json();
  return result;
}

export const get = <T>(endpoint: string, config?: Omit<RequestInit, 'method'>): Promise<T> =>
  api<T>(endpoint, { ...config, method: 'GET' });

export const post = <T, B>(endpoint: string, body: B, config?: Omit<RequestInit, 'method' | 'body'>): Promise<T> =>
  api<T>(endpoint, { ...config, method: 'POST', data: body });

export const put = <T, B>(endpoint: string, body: B, config?: Omit<RequestInit, 'method' | 'body'>): Promise<T> =>
  api<T>(endpoint, { ...config, method: 'PUT', data: body });

export const del = <T>(endpoint: string, config?: Omit<RequestInit, 'method'>): Promise<T> =>
  api<T>(endpoint, { ...config, method: 'DELETE' });
