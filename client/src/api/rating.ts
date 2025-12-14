export const getAllRaters = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ratings?type=received`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || 'Failed to fetch api in get all rating';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllRatees = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ratings?type=given`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || 'Failed to fetch api in get all rating';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
