import * as productService from "../services/productService";
import { Request, Response } from "express";
import {
  productQueryDto,
  updateProductDto,
  buyNowProuctDto,
} from "../dto/productDto";
import { uploadImagesToSupabase } from "../utils/uploadImage";
import { uploadedImageDto } from "../dto/uploadImageDto";
import { checkRole } from "../utils/checkRole";
import { gatewayResponse } from "../utils/response";
import { HttpStatus } from "../utils/permission";
import { sendEmail, loadOrderTemplate } from "../utils/sendEmail";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id;
    let roles = await checkRole(sellerId);

    if (!roles.includes("SELLER")) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: User is not a seller",
      });
    }

    const body = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    const uploadedImages = await uploadImagesToSupabase(files, "products");

    const result = await productService.createProduct(sellerId, {
      ...body,
      images: uploadedImages,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? "Internal Server Error",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const result = await productService.getProductById(productId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? "Internal Server Error",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id;
    console.log("Seller ID:", sellerId);

    let roles = await checkRole(sellerId);
    console.log(roles);

    if (!roles.includes("SELLER")) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: User is not a seller",
      });
    }

    const productId = req.params.id;
    const product = await productService.getProductById(productId);

    if (product?.sellerId !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản không có quyền chỉnh sửa sản phẩm này",
      });
    }

    const body = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    let uploadedImages: uploadedImageDto[] = [];

    if (files && files.length > 0) {
      uploadedImages = await uploadImagesToSupabase(files, "products");
    }

    const payload: Partial<updateProductDto> = {
      ...body,
      ...(uploadedImages.length > 0 && { images: uploadedImages }),
    };

    const result = await productService.updateProduct(productId, payload);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? "Internal Server Error",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id;
    let roles = await checkRole(sellerId);

    if (!roles.includes("SELLER") && !roles.includes("ADMIN")) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: User is not a seller or admin",
      });
    }

    const productId = req.params.id;

    await productService.deleteProduct(productId);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? "Internal Server Error",
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query as productQueryDto;
    const result = await productService.searchProducts(queryParams);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? "Internal Server Error",
    });
  }
};

export const buyNowProduct = async (req: Request, res: Response) => {
  try {
    const bidderId = req.user!.id;
    const productId = req.params.id;
    let roles = await checkRole(bidderId);

    if (!roles.includes("BIDDER")) {
      const respone = gatewayResponse(
        HttpStatus.forbidden,
        null,
        "Người ra giá phải là BIDDER"
      );

      return res.status(respone.code).send(respone);
    }
    const data: buyNowProuctDto = req.body;
    data.productId = productId;

    if (!data.phoneNumber || !data.shippingAddress) {
      throw new Error("Dữ liệu không hợp lệ");
    }
    const response = await productService.buyNowProuct(bidderId, data);

    const content = loadOrderTemplate(
      response?.product.title || "",
      response?.product.buyNowPrice.toString() || "",
      response?.product.seller.email || "",
      response?.buyer.email || ""
    );

    try {
      let dataEmail = {
        email: response?.buyer.email || "",
        subject: "Thông tin đơn hàng mua ngay",
        content: content,
      };
      await sendEmail(dataEmail);

      dataEmail = {
        email: response?.product.seller.email || "",
        subject: "Thông tin đơn hàng mua ngay",
        content: content,
      };

      await sendEmail(dataEmail);
    } catch (err) {
      console.error("Lỗi gửi email:", err);
    }

    const respone = gatewayResponse(
      HttpStatus.ok,
      response,
      "Mua ngay sản phẩm thành công"
    );
    return res.status(respone.code).send(respone);
  } catch (error: any) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
};
