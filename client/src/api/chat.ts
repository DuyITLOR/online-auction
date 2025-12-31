export const getAllChats = async (token: string, signal?: AbortSignal) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chats`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Kết nối tới server thất bại');
  }

  return data.data;
};

export const getAllMessages = async (
  token: string,
  productId: string,
  signal: AbortSignal
) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/products/${productId}/chat`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Kết nối tới server thất bại');
  }

  return data.data;
};
