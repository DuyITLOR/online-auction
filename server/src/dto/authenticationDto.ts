export interface emailVerificationDto {
  email: string;
  code: string;
  expiresAt: Date;
}
