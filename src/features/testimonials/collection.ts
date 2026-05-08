import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

export const testimonialsCollection = defineCollection({
  loader: glob({
    base: "./src/content/testimonials",
    pattern: "**/*.{json,yaml,yml}",
  }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    quote: z.string(),
    location: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});
