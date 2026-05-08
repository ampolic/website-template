import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

import { seoSchema } from "@/lib/content-schemas";

export const servicesCollection = defineCollection({
  loader: glob({
    base: "./src/content/services",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string().optional(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    icon: z.string().optional(),
    draft: z.boolean().default(false),
    seo: seoSchema.optional(),
  }),
});
