export interface getAllChatsDto {
  userId: string;
}

export interface chatsDto {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  buyerAvt: string;
  sellerId: string;
  sellerName: string;
  sellerAvt: string;
}

export interface messageDto {
  id: string;
  content: string;
  sendAt: Date;
  avtUrl: string;
  senderId: string;
  senderName: string;
}

export interface getMessageDto {
  productId: string;
  limit?: number;
}

export interface sendMessageDto {
  productId: string;
  senderId: string;
  content: string;
}
