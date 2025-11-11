import { z } from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email().trim(),
});


