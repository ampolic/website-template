import { getCollection } from "astro:content";

export async function getPublishedFaqs() {
  const faqs = await getCollection("faqs", ({ data }) => !data.draft);

  return faqs.sort((a, b) => a.data.order - b.data.order);
}
