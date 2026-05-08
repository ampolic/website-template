import { z } from "astro/zod";

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  noindex: z.boolean().default(false),
});
