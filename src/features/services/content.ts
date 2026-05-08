import { getCollection } from "astro:content";

export async function getPublishedServices() {
  const services = await getCollection("services", ({ data }) => !data.draft);

  return services.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedServices() {
  const services = await getPublishedServices();

  return services.filter((service) => service.data.featured);
}
