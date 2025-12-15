export const getCommentsByProduct = async ({ id }: { id: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/comments/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.message || data.error || 'Failed to fetch comment api';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
