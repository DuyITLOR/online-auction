export const getAllProductByBidder = async (token: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders?view=BIDDER`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const message =
        data.message || data.errors || "Failed to fetch product sell by user";
      throw new Error(message);
    }

    console.log("Fetched products by bidder:", data.data);
    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getOrderInfo = async (orderId: string, token: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );
    const data = await res.json();

    if (!res.ok) {
      const message =
        data.message || data.errors || "Failed to fetch order info";
      throw new Error(message);
    }

    return data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


export const uploadOrderQR = async ( orderId: string, token: string, qrInfo: string, image: File) => {
  const formData = new FormData();
  formData.append('qrInfo', qrInfo);
  formData.append('image', image);

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/qr`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Failed to upload order QR');
  }

  return data.data;
}