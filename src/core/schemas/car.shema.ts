import { z } from 'zod';

export const carSchema = z.object({
  manufacturerId: z.number(),
  modelId: z.number(),
  typeId: z.number(),
  price: z.number().min(1),
});

export const carDetailsSchema = z.object({
  description: z.string().min(1).max(1000),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
});

export const fullCarSchema = carSchema.merge(carDetailsSchema);
