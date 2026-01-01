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

    // console.log("Fetched products by bidder:", data.data);
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
    throw new Error(data.message || data.error || 'Tải thông tin QR thất bại');
  }

  return data.data;
}

export const uploadPayment = async ( orderId: string, token: string, buyerAddress: string, buyerPhone: string , image: File) => {
  const formData = new FormData();
  formData.append('buyerAddress', buyerAddress);
  formData.append('buyerPhone', buyerPhone);
  formData.append('image', image);

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/payment`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'PATCH',
    body: formData,
    })

  const data = await res.json();
    
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Tải thông tin thanh toán thất bại');
  }

  return data.data;
}

export const uploadShippingInfo = async ( orderId: string, token: string, shippingCode: string, image: File) => {
  const formData = new FormData();
  formData.append('shippingCode', shippingCode);
  formData.append('image', image);

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/shipping`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'PATCH',
    body: formData,
    })

  const data = await res.json();
    
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Tải thông tin vận chuyển thất bại'); 
  }

  return data.data;
}

export const confirmOrder = async (orderId: string, token: string) => {
   const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/confirm`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'PATCH',
   })

  const data = await res.json();
    
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Xác nhận đơn hàng thất bại'); 
  }

  return data.data;
}


export const ratingOrder = async (token: string, evaluatee:string ,productId: string, orderId: string , rating: number, comment: string) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ratings/users/${evaluatee}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        productId: productId,
        value: rating,
        comment: comment, 
        orderId: orderId,
      })
    })

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Đánh giá thất bại'); 
    }
    
    return data.data;
}