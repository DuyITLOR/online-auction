enum sort {
  createdAt_asc = 'createdAt_asc',
  fullename_asc = 'fullename_asc',
}

export interface getAllUsersServiceDto {
  limit: number;
  page: number;
}
