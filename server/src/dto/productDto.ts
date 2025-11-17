import { ProductImageDto } from "./productImageDto";

export interface CreateProductDto {
  sellerId: string;
  categoryId: string;
  title: string;
  description: string;
  startPrice: string;
  stepPrice: string;
  buyNowPrice: string;
  startedAt: string;
  endAt: string;
  autoExtendEnabled?: boolean;
  autoExtendMinutes?: number;
  highRatingRequired?: boolean;

  images: ProductImageDto[];
}


export interface UpdateProductDTO {
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

  images?: ProductImageDto[];
}



export interface ProductQueryDTO {
  q?: string; // Full-text search
  categoryId?: string;
  page?: string; // query params to pagination
  limit?: string;
  sort?: string; // "price_asc", "price_desc", "endAt_asc", "endAt_desc", "createdAt_desc"
  highlightMinutes?: string; // Filter: new product
}
