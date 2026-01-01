export interface ratingInputDto {
  orderId: string;
  productId: string;
  value: number;
  comment: string;
}

export interface ratingDto {
  orderId: string;
  raterId: string;
  rateeId: string;
  productId: string;
  value: number;
  comment: string;
}

export interface updateRatingDto {
  id: string;
  value?: string;
  comment?: string;
}

export interface getRatingDto {
  userId: string;
  type: string;
  page: number;
  limit: number;
}

export interface deleteRatingDto {
  ratingId: string;
  userId: string;
}
