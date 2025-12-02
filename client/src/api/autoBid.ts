export const autoBid = async ({
  productId,
  maxAutoBidAmount,
  token,
}: {
  productId: string;
  maxAutoBidAmount: number;
  token: string;
}) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/autoBid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, maxAutoBidAmount }),
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data?.message || data?.error || `Request failed with status ${res.status}`;

      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
