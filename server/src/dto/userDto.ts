export interface updateUserDto {
  fullname?: string;
  avtUrl?: string;
}

export interface requestUpgradeDto {
  id: string;
  note: string;
}

export interface blockUserDto {
  productId: string;
  userId: string;
  reason: string;
}
