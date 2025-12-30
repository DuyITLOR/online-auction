import { productImageDto } from './productImageDto';

export interface createProductDto {
  sellerId: string;
  categoryId: string;
  title: string;
  description: string;
  startPrice: string;
  stepPrice: string;
  buyNowPrice: string;
  startedAt: string;
  endAt: string;
  autoExtendEnabled?: string;
  autoExtendMinutes?: number;
  highRatingRequired?: string;

  images: productImageDto[];
}

export interface updateProductDto {
  sellerId?: string;
  categoryId?: string;
  title?: string;
  description?: string;
  startPrice?: string;
  stepPrice?: string;
  buyNowPrice?: string;
  startedAt?: string;
  endAt?: string;
  autoExtendEnabled?: boolean;
  autoExtendMinutes?: number;
  highRatingRequired?: boolean;
  images?: productImageDto[];
}

export interface productQueryDto {
  q?: string; // Full-text search
  categoryId?: string;
  page?: string; // query params to pagination
  limit?: string;
  sort?: string; // "price_asc", "price_desc", "createdAt_asc", "createdAt_desc"
  sellerId?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface buyNowProuctDto {
  productId: string;
  buyerId: string;
  phoneNumber: string;
  shippingAddress: string;
}
