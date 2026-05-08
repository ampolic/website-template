import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

export const faqsCollection = defineCollection({
  loader: glob({
    base: "./src/content/faqs",
    pattern: "**/*.{json,yaml,yml}",
  }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string().default("General"),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});
