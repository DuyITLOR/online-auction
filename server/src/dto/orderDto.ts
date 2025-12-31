export interface orderQueryDto {
    userId?: string;
    page?: string;
    limit?: string;
    q?: string;
    view?: string;
}

export interface orderBankInfo {
    orderId: string,
    sellerId: string,
    bankInfor: string,
    qrUrl:  string,
}


export interface orderPaymentInfo {
    orderId: string,
    buyerId: string,
    billUrl: string,
    buyerAddress: string,
    buyerPhone: string,
}

