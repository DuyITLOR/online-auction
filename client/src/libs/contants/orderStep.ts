import type { OrderStatus } from '../types/types';

export const ORDER_STATUS_TO_STEP: Record<OrderStatus, number> = {
  WAIT_SELLER_BANK_INFO: 1,          // Seller upload QR
  WAIT_BUYER_PAYMENT: 2,             // Buyer thanh toán
  WAIT_SELLER_SHIPPING: 3,           // Seller gửi hàng
  WAIT_BUYER_CONFIRM_RECEIVE: 4,     // Buyer nhận hàng
  WAIT_REVIEW: 5,                    // Đánh giá
  COMPLETED: 5,
  CANCELLED: 0,                      // optional
};
