import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

import { seoSchema } from "@/lib/content-schemas";

export const projectsCollection = defineCollection({
  loader: glob({
    base: "./src/content/projects",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    location: z.string().optional(),
    service: z.string().optional(),
    completedAt: z.coerce.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    gallery: z.array(z.string()).default([]),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    seo: seoSchema.optional(),
  }),
});
