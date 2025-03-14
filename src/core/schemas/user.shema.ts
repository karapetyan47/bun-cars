import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const registerSchema = z
  .object({
    name: z.string().min(2).max(100),
  })
  .merge(loginSchema);

export const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).max(100).optional(),
  password: z.string().min(8).max(100).optional(),
});
