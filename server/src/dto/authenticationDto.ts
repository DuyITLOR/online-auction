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

export interface verifyDto {
  email: string;
  fullname: string;
  hashed: string;
  avtUrl: string;
  dateOfBirth: string;
  address: string;
}
