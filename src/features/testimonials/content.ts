import { getCollection } from "astro:content";

export async function getPublishedTestimonials() {
  const testimonials = await getCollection(
    "testimonials",
    ({ data }) => !data.draft,
  );

  return testimonials.sort((a, b) => a.data.order - b.data.order);
}
