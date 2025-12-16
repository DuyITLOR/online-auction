export interface getMessageDto {
  productId: string;
  limit?: number;
}

export interface sendMessageDto {
  productId: string;
  senderId: string;
  content: string;
}
