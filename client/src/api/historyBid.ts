export const getHistoryBid = async ({
  productId,
  token,
  desc,
}: {
  productId: string;
  token: string;
  desc: boolean;
}) => {
  try {
    const url = desc ? `autoBid/${productId}/history?amount=desc` : `autoBid/${productId}/history`;
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || 'Failed to fetch history bid';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getActivitiesOfUser = async ({ token, limit, page }: { token: string; limit: number; page: number }) => {
  try {
    const queryParams = `?page=${page ? page : 1}&limit=${limit ? limit : 5}`;
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/autoBid${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || 'Failed to fetch activities bid of user';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
