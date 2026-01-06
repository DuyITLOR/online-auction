import * as productService from '../services/productService';
import { Request, Response } from 'express';
import {
  productQueryDto,
  updateProductDto,
  buyNowProuctDto,
} from '../dto/productDto';
import { uploadImagesToSupabase } from '../utils/uploadImage';
import { uploadedImageDto } from '../dto/uploadImageDto';
import { checkRole } from '../utils/checkRole';
import { gatewayResponse } from '../utils/response';
import { HttpStatus } from '../utils/permission';
import {
  sendEmail,
  loadOrderTemplate,
  loadProductDescriptionChangedTemplate,
} from '../utils/sendEmail';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id;
    let roles = await checkRole(sellerId);

    if (!roles.includes('SELLER')) {
      return res.status(403).json({
        success: false,
        message: 'Bị cấm: Người dùng không phải là người bán',
      });
    }

    const body = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    const uploadedImages = await uploadImagesToSupabase(files, 'products');

    const result = await productService.createProduct(sellerId, {
      ...body,
      images: uploadedImages,
    });

    res.status(201).json({
      success: true,
      message: 'Sản phẩm được tạo thành công',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? 'Internal Server Error',
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
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sản phẩm được lấy thành công',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? 'Internal Server Error',
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id;
    console.log('Seller ID:', sellerId);

    let roles = await checkRole(sellerId);
    console.log(roles);

    if (!roles.includes('SELLER')) {
      return res.status(403).json({
        success: false,
        message: 'Bị cấm: Người dùng không phải là người bán',
      });
    }

    const productId = req.params.id;
    const product = await productService.getProductById(productId);

    if (product?.sellerId !== sellerId) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản không có quyền chỉnh sửa sản phẩm này',
      });
    }

    const body = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    let uploadedImages: uploadedImageDto[] = [];

    if (files && files.length > 0) {
      uploadedImages = await uploadImagesToSupabase(files, 'products');
    }

    const payload: Partial<updateProductDto> = {
      ...body,
      ...(uploadedImages.length > 0 && { images: uploadedImages }),
    };

    const result = await productService.updateProduct(productId, payload);

    const winnerId = result.winnerId || null;
    if (winnerId) {
      const productLink = `${process.env.FRONTEND_URL}/product/${result.id}`;
      const content = loadProductDescriptionChangedTemplate(
        result.title,
        productLink
      );
      sendEmail({
        email: result.winner?.email || '',
        subject: 'Cập nhật mô tả sản phẩm đấu giá',
        content: content,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sản phẩm được cập nhật thành công',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? 'Internal Server Error',
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id;
    let roles = await checkRole(sellerId);

    if (!roles.includes('SELLER') && !roles.includes('ADMIN')) {
      return res.status(403).json({
        success: false,
        message:
          'Bị cấm: Người dùng không phải là người bán hoặc quản trị viên',
      });
    }

    const productId = req.params.id;

    await productService.deleteProduct(productId);
    res.status(200).json({
      success: true,
      message: 'Sản phẩm được xóa thành công',
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? 'Internal Server Error',
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
        message: 'Không tìm thấy sản phẩm nào',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sản phẩm được lấy thành công',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? 'Internal Server Error',
    });
  }
};

export const buyNowProduct = async (req: Request, res: Response) => {
  try {
    const bidderId = req.user!.id;
    const productId = req.params.id;
    let roles = await checkRole(bidderId);

    if (!roles.includes('BIDDER')) {
      const respone = gatewayResponse(
        HttpStatus.forbidden,
        null,
        'Người ra giá phải là BIDDER'
      );

      return res.status(respone.code).send(respone);
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      const respone = gatewayResponse(
        HttpStatus.notFound,
        null,
        'Không tìm thấy sản phẩm'
      );
      return res.status(respone.code).send(respone);
    }

    const data: buyNowProuctDto = {
      buyerId: bidderId,
      sellerId: product.sellerId,
      totalAmount: Number(product.buyNowPrice) || 0,
      productId: productId,
    };

    const response = await productService.buyNowProuct(data);
    const orderLink = `${process.env.FRONTEND_URL}/payment/${response?.id}`;
    const content = loadOrderTemplate(
      response?.product.title || '',
      response?.product.buyNowPrice?.toString() || '',
      response?.product.seller.email || '',
      response?.buyer.email || '',
      orderLink
    );

    try {
      let dataEmail = {
        email: response?.buyer.email || '',
        subject: 'Thông tin đơn hàng mua ngay',
        content: content,
      };
      sendEmail(dataEmail);

      dataEmail = {
        email: response?.product.seller.email || '',
        subject: 'Thông tin đơn hàng mua ngay',
        content: content,
      };

      sendEmail(dataEmail);
    } catch (err) {
      console.error('Lỗi gửi email:', err);
    }

    const respone = gatewayResponse(
      HttpStatus.ok,
      response,
      'Mua ngay sản phẩm thành công'
    );
    return res.status(respone.code).send(respone);
  } catch (error: any) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    const response = gatewayResponse(HttpStatus.badRequest, null, message);
    return res.status(response.code).send(response);
  }
};
