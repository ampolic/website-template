export const siteConfig = {
  locale: "en-US",
  url: "https://example.com",
  business: {
    name: "Evergreen Local Services",
    legalName: "Evergreen Local Services LLC",
    tagline: "Reliable work from a local team.",
    description:
      "A practical starter site for local service businesses that need fast, polished static websites.",
    phone: "(555) 123-4567",
    phoneHref: "tel:+15551234567",
    email: "hello@example.com",
    emailHref: "mailto:hello@example.com",
    address: {
      street: "123 Main Street",
      city: "Springfield",
      region: "IL",
      postalCode: "62701",
      country: "US",
    },
    hours: ["Mo-Fr 08:00-17:00", "Sa 09:00-13:00"],
  },
  serviceAreas: ["Springfield", "Riverton", "Chatham", "Sherman", "Rochester"],
  primaryCta: {
    label: "Request an Estimate",
    href: "/contact",
  },
  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
    youtube: "",
  },
  contactAction: import.meta.env.PUBLIC_CONTACT_FORM_ACTION ?? "",
  seo: {
    title: "Evergreen Local Services | Local Service Business",
    description:
      "A fast, SEO-friendly starter website for local service businesses.",
    image: "/images/hero.svg",
    themeColor: "#2f7662",
  },
} as const;

export type SiteConfig = typeof siteConfig;
