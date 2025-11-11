import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(1, 'Password can not empty'),
});
