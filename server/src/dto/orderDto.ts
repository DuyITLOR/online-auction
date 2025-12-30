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