import cron from "node-cron";
import * as productService from "../services/productService.js";

export const auctionEndJob = cron.schedule("* * * * *", async () => {
  console.log("Running auction end job...");

  try {
    const listProduct = await productService.getProductActive();

    for (const product of listProduct) {
      try {
        await productService.handleAuctionEnd(product.id);
      } catch (err: any) {
        throw new Error(`Cập nhật trạng thái đấu giá thất bại: ${err.message}`);
      }
    }
  } catch (err: any) {
    throw new Error(`Lấy danh sách sản phẩm thất bại: ${err.message}`);
  }
});
