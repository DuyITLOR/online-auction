import * as productService from '../services/productService';
import { Request, Response } from 'express';
import { productQueryDto, updateProductDto } from '../dto/productDto';
import { uploadImagesToSupabase } from '../utils/uploadImage';
import { uploadedImageDto } from '../dto/uploadImageDto';
import { checkRole } from '../utils/checkRole';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user!.id;
    let roles = await checkRole(sellerId);

    if (!roles.includes('SELLER')) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: User is not a seller',
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
      message: 'Product created successfully',
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
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
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
    let roles = await checkRole(sellerId);

    if (!roles.includes('SELLER')) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: User is not a seller',
      });
    }

    const productId = req.params.id;
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

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
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

    if (!roles.includes('SELLER')) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: User is not a seller',
      });
    }

    const productId = req.params.id;

    await productService.deleteProduct(productId);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
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
        message: 'No products found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message ?? 'Internal Server Error',
    });
  }
};
