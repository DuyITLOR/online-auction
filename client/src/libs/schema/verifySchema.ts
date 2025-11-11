import { z } from 'zod';

export const VerifySchema = z.object({
  name: z.string().min(1, 'User name can not empty').trim(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).*$/, {
      message: 'Password must contain at least one letter, one number, and one special character',
    }),
  code: z.string().min(1, 'Verification code can not empty').trim(),
});
