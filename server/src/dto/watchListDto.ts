export interface addWatchListDto {
    productId: string,
}

export interface removeWatchListDto {
    productId: string,
}

export interface getWatchListDto {
    page?: string; 
    limit?: string;
}
