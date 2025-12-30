export interface requestUpgradeDto {
  id: string;
  note: string;
}

export interface updateUserDto {
  fullname?: string;
  dateOfBirth?: string;
  address?: string;
  avtUrl?: string;
}

export interface blockUserDto {
  productId: string;
  userId: string;
  reason: string;
}

export interface askSellerDto {
  productId: string;
  senderId: string;
  question: string;
}

export interface askSellerReturnDto {
  success: true;
  sellerEmail: string;
  askerEmail: string;
  productName: string;
  question: string;
}
export interface answerBidderDto {
  commentId: string;
  productId: string;
  answer: string;
  sellerId: string;
}

export interface answerBidderReturnDto {
  success: true;
  bidderEmail: string;
  productName: string;
  answer: string;
}

export interface deleteCommentDto {
  userId: string;
  commentId: string;
}

export interface getALlCommentsDto {
  productId: string;
  page: number;
  limit: number;
}

export interface returnErrorDto {
  success: false;
  message: string;
}


export interface responseProfileDto {
  BidCount: number;
  WatchListCount: number;
  OrderCount: number;
  RatingCount: number;
}