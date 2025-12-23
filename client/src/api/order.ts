export const getAllProductByBidder = async (token: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders?view=BIDDER`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.message || data.errors || 'Failed to fetch product sell by user';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
