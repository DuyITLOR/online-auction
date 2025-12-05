export interface autoBidDto{
    productId: string,
    bidderId: string,
    maxAutoBidAmount: number
}


export interface computeBidDto{
    productId: string,
    newBidderId: string,
    newMax : number 
}

export interface bidHistoryQueryDto{
    page?: string;
    limit?: string;
    productId?: string;
    userId?: string;
    // price_desc, endAt_asc
    sort?: string;
}