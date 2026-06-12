import type {
  BlogPosting as SchemaBlogPosting,
  BreadcrumbList,
  FAQPage,
  LocalBusiness,
  Service,
  WithContext,
} from "schema-dts";

import { siteConfig } from "@/config/site";

function absoluteUrl(path: string, site?: URL) {
  const base = site?.toString() ?? siteConfig.url;
  return new URL(path, base).toString();
}

export function getLocalBusinessSchema(site?: URL): WithContext<LocalBusiness> {
  const { business } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    legalName: business.legalName,
    description: business.description,
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(business.email ? { email: business.email } : {}),
    url: absoluteUrl("/", site),
    image: absoluteUrl(siteConfig.seo.image, site),
    address: {
      "@type": "PostalAddress",
      ...(business.address.street
        ? { streetAddress: business.address.street }
        : {}),
      ...(business.address.city
        ? { addressLocality: business.address.city }
        : {}),
      ...(business.address.region
        ? { addressRegion: business.address.region }
        : {}),
      ...(business.address.postalCode
        ? { postalCode: business.address.postalCode }
        : {}),
      addressCountry: business.address.country,
    },
    areaServed: siteConfig.serviceAreas as string[],
    ...(business.hours.length > 0 ? { openingHours: business.hours } : {}),
    sameAs: Object.values(siteConfig.social).filter(Boolean) as string[],
  } as WithContext<LocalBusiness>;
}

export function getServiceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}): WithContext<Service> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.business.name,
      url: absoluteUrl("/"),
    },
    areaServed: siteConfig.serviceAreas as string[],
    url: absoluteUrl(url),
  } as WithContext<Service>;
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function getBlogPostingSchema({
  title,
  description,
  url,
  publishDate,
  updatedDate,
  author,
  image,
}: {
  title: string;
  description: string;
  url: string;
  publishDate: Date;
  updatedDate?: Date;
  author: string;
  image?: string;
}): WithContext<SchemaBlogPosting> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: absoluteUrl(url),
    datePublished: publishDate.toISOString(),
    dateModified: (updatedDate ?? publishDate).toISOString(),
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.business.name,
      url: absoluteUrl("/"),
    },
    ...(image ? { image: absoluteUrl(image) } : {}),
  } as WithContext<SchemaBlogPosting>;
}

export function getFAQPageSchema(
  items: Array<{ question: string; answer: string }>,
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
