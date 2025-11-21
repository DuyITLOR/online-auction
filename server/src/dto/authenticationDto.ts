export interface emailVerificationDto {
  email: string;
  code: string;
  expiresAt: Date;
}

export interface profileDto {
  email: string;
  fullname: string;
  avtUrl: string;
}
