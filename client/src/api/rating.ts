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

export const updateRating = async ({
  id,
  token,
  value,
  comment,
}: {
  id: string;
  token: string;
  value: number;
  comment: string;
}) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ratings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ value, comment }),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.message || data.error || 'Failed to fetch update rating api';
      throw new Error(message);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllRatingsByUserId = async ({
  id,
  token,
  page = 1,
  limit = 2,
}: {
  id: string;
  token: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ratings/users/${id}?${params}`, {
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
