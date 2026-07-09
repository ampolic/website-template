import { z } from "astro/zod";

export const publicPathOrUrl = z.string().refine(
  (value) => {
    if (value.startsWith("/")) {
      return true;
    }

    try {
      const url = new URL(value);

      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "Expected an absolute public path or http(s) URL." },
);

export const optionalPublicPathOrUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  publicPathOrUrl.optional(),
);

export const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  noindex: z.boolean().default(false),
});
