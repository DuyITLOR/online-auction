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
