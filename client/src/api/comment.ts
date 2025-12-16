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

export const postQuestion = async ({ id, token, content }: { id: string; token: string; content: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products/${id}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question: content }),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.message || data.error || 'Failed to fetch post comment api';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const postAnswer = async ({
  questionId,
  productId,
  token,
  content,
}: {
  questionId: string;
  productId: string;
  token: string;
  content: string;
}) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/comments/${questionId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: productId, answer: content }),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.message || data.error || 'Failed to fetch post answer api';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
