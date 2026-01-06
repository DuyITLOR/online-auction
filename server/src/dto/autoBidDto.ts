export interface autoBidDto {
  productId: string;
  bidderId: string;
  maxAutoBidAmount: number;
}

export interface computeBidDto {
  productId: string;
  newBidderId: string;
  newMax: number;
}

export interface bidHistoryQueryDto {
  page?: string;
  limit?: string;
  // price_desc, endAt_asc
  sort?: string;
}

export interface autoBidResult{
    product: {
        id: string;
        name: string;
        price: number;
    }, 
    winner: {
        name: string;
        email: string;
    },
    lastWinner: {
        name: string;
        email: string;
        type: string;
    }, 
    seller: {
        name: string;
        email: string;
    }
}

export interface computeBid{
    winner: string,
    winnerId: string,
    email: string,
    price: number
}

export interface recomputeDto {
  productId: string;
  bidderId: string;
}

export interface autoBidQueryDto {
  page?: string;
  limit?: string;
  // createAt_desc, createAt_asc
  sort?: string;
}