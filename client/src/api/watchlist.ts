export const createWatchList = async ({ productId, token }: { productId: string; token: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || 'Failed to post watch list';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllWatchList = async ({ token, page }: { token: string; limit?: number; page?: number }) => {
  try {
    const queryParams = `?page=${page ? page : 1}&limit=${8}`;
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/watchlist${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || 'Failed to get all watch list';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteWatchList = async ({ productId, token }: { productId: string; token: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/watchlist`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || 'Failed to delete watch list';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
