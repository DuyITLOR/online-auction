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

export const getAllProduct = async ({
  page = 1,
  limit = '10',
  categoryId,
  sort,
  q,
}: {
  page?: number;
  limit?: string;
  categoryId?: string;
  sort?: string;
  q?: string;
}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: limit,
    });

    if (categoryId) params.append('categoryId', categoryId);
    if (sort) params.append('sort', sort);
    if (q) params.append('q', q);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product?${params}`);
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
