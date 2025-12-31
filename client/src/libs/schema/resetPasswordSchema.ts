import z from 'zod';

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).*$/, {
      message: 'Password must contain at least one letter, one number, and one special character',
    }),
});
