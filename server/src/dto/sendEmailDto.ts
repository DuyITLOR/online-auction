export interface sendEmailDto {
	email: string,
	subject: string,
	content: string,
}

export interface sendEmailResultDto {
  success: boolean;
  message: string;
  id?: string | null;
}