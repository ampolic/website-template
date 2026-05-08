import { blogCollection } from "@/features/blog/collection";
import { faqsCollection } from "@/features/faq/collection";
import { projectsCollection } from "@/features/projects/collection";
import { servicesCollection } from "@/features/services/collection";
import { testimonialsCollection } from "@/features/testimonials/collection";

export const collections = {
  services: servicesCollection,
  testimonials: testimonialsCollection,
  projects: projectsCollection,
  faqs: faqsCollection,
  blog: blogCollection,
};
