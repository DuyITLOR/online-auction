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

export const getAllProduct = async (page: number, coursePerPage: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product?page=${page}&limit=${coursePerPage}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch all products');
    }

    return {
      data: data.data.data,
      totalPage: data.data.totalPages,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
