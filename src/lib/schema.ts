import { siteConfig } from "@/config/site";

function absoluteUrl(path: string, site?: URL) {
  const base = site?.toString() ?? siteConfig.url;
  return new URL(path, base).toString();
}

export function getLocalBusinessSchema(site?: URL) {
  const { business } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    legalName: business.legalName,
    description: business.description,
    telephone: business.phone,
    email: business.email,
    url: absoluteUrl("/", site),
    image: absoluteUrl(siteConfig.seo.image, site),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    openingHours: business.hours,
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };
}

export function getServiceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
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
    areaServed: siteConfig.serviceAreas,
    url: absoluteUrl(url),
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
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
}) {
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
  };
}

export function getFAQPageSchema(
  items: Array<{ question: string; answer: string }>,
) {
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
