export const getRole = async ({ token }: { token: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || 'Failed in check role api';
      throw new Error(message);
    }

    return data.data.user; 
  } catch (err) {
    console.error(err);
    throw err;
  }
};
