export interface createCategoryDto {
  name: string;
  parentId?: string;
}
export interface updateCategoryDto {
  name?: string;
  parentId?: string;
}

export interface categoryQueryDto {
  q?: string;
  parentId?: string; // thêm vào
  product?: boolean;
  limit?: number;
  page?: number;
}
