export interface createCategoryDto {
  name: string;
  parentId?: string;
}
export interface updateCategoryDto {
  name?: string;
  parentId?: string;
}

export interface categoryQueryDto {
  q?: string; // Full-text search
  parents?: string; // parent category ID
}
