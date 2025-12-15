import cron from "node-cron";
import * as productService from "../services/productService.js";

export const auctionEndJob = cron.schedule(
  "* * * * *",
  async () => {
    console.log("Running auction end job...");

    const listProduct = await productService.getProductActive();

    for (const product of listProduct) {
        
    }
  }
);
