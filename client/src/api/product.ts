export const getProduct = async (productId: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/${productId}`);
    const data = await res.json();
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
  minPrice,
  maxPrice,
  sellerId,
  isBidder,
}: {
  page?: number;
  limit?: string;
  categoryId?: string;
  sort?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  sellerId?: string;
  isBidder?: string;
}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: limit,
    });

    if (categoryId) params.append('categoryId', categoryId);
    if (sort) params.append('sort', sort);
    if (q) params.append('q', q);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sellerId) params.append('sellerId', sellerId);
    if (isBidder) params.append('isBidder', isBidder);

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

interface CreateProductPayload {
  sellerId: string;
  categoryId: string;
  title: string;
  description: string;
  startPrice: number | string;
  stepPrice: number | string;
  buyNowPrice: number | string;
  startedAt: string;
  endAt: string;
  allowedExtend: boolean;
  highRatingRequired: boolean;
  images: File[];
}

export const createProduct = async ({ product, token }: { product: CreateProductPayload; token: string }) => {
  const formData = new FormData();

  console.log(product.allowedExtend.toString());

  formData.append('sellerId', product.sellerId);
  formData.append('categoryId', product.categoryId);
  formData.append('title', product.title);
  formData.append('autoExtendEnabled', product.allowedExtend.toString());
  formData.append('highRatingRequired', product.highRatingRequired.toString());
  formData.append('description', product.description);
  formData.append('startPrice', product.startPrice.toString());
  formData.append('stepPrice', product.stepPrice.toString());
  formData.append('buyNowPrice', product.buyNowPrice.toString());
  formData.append('startedAt', product.startedAt);
  formData.append('endAt', product.endAt);

  product.images.forEach((file: File) => {
    formData.append('images', file);
  });

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    const message = data.message || data.error || 'Failed in create product api';
    throw new Error(message);
  }

  return data.data;
};

export const updateProduct = async ({ id, description, token }: { id: string; description: string; token: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description }),
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || 'Failed to fetch in update product';
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const buyNow = async ({ productId, token }: { productId: string; token: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/${productId}/buy-now`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      const message = data.message || data.error || 'Failed to buy now product';
      throw new Error(message);
    }
    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
