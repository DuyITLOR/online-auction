'use server';

export const getProduct = async (productId: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/${productId}`);
    const data = await res.json();
    console.log(productId);
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch product');
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllProduct = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch all products');
    }

    return data.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
