export const getCategories = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-cache',
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch category api');
    }

    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
