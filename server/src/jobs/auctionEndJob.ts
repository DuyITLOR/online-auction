import cron from 'node-cron';
import * as orderService from '../services/orderService';
import * as productService from '../services/productService';
import {
  sendEmail,
  loadOrderTemplate,
  loadNoBuyerTemplate,
} from '../utils/sendEmail';

let isRunning = false;

export const auctionEndJob = cron.schedule('* * * * *', async () => {
  if (isRunning) {
    console.log('Auction end job is still running. Skipping this run.');
    return;
  }
  isRunning = true;
  // console.log("Running auction end job...");
  try {
    const listProduct = await productService.getExpiredActiveProducts();
    // console.log(`The number of products: ${listProduct.length}`);
    for (const product of listProduct) {
      try {
        const data = await orderService.createOrder(product.id);
        if (!data) {
          console.log(`Tạo đơn hàng thất bại cho sản phẩm ${product.id}`);
          continue;
        }

        if (data.type === 'NO_BIDDER') {
          const content = loadNoBuyerTemplate(
            data.product.seller.fullname ?? 'Người bán',
            data.product.title
          );
          if (!data.product.seller.email)
            throw new Error('Không lấy được email người bán');

          sendEmail({
            email: data.product.seller.email,
            subject: 'Đấu giá kết thúc — Không có người mua',
            content: content,
          });
        } else if (data.type === 'HAS_BIDDER') {
          if (
            !data.product.title ||
            !data.product.currentPrice ||
            !data.product.seller.email ||
            !data.order?.buyer.email
          )
            throw new Error('Thiếu thông tin để gửi email đơn hàng');
          const orderLink = `${process.env.FRONTEND_URL}/payment/${data.order.id}`;
          const content = loadOrderTemplate(
            data.product.title,
            data.product.currentPrice.toString(),
            data.product.seller.email,
            data.order?.buyer.email,
            orderLink
          );
          Promise.all([
            sendEmail({
              email: data.order.buyer.email,
              subject: 'Thông tin đơn hàng đấu giá thành công',
              content: content,
            }),
            sendEmail({
              email: data.product.seller.email,
              subject: 'Đơn hàng đấu giá sản phẩm của bạn đã có người mua',
              content: content,
            }),
          ]).catch((err) => {
            console.error('Email sending failed:', err);
          });
        }
      } catch (err: any) {
        console.error(`Cập nhật trạng thái đấu giá thất bại: ${err.message}`);
        continue;
      }
    }
  } catch (err: any) {
    console.error(`Lấy danh sách sản phẩm thất bại: ${err.message}`);
  } finally {
    isRunning = false;
  }
});
