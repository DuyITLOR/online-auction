export interface createCategoryDto {
  name: string;
  parentId?: string;

}
export interface updateCategoryDto {
  name?: string;
  parentId?: string;
}
