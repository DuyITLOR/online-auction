export interface ratingInputDto {
  productId: string;
  value: number;
  comment: string;
}

export interface ratingDto {
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
}
