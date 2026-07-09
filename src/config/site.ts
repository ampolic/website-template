export type SiteConfig = {
  locale: string;
  url: string;
  business: {
    name: string;
    legalName: string;
    tagline: string;
    taglineShort: string;
    description: string;
    phone: string;
    phoneHref: string;
    email: string;
    emailHref: string;
    address: {
      street: string;
      city: string;
      region: string;
      postalCode: string;
      country: string;
    };
    hours: string[];
  };
  serviceAreas: string[];
  primaryCta: {
    label: string;
    href: string;
  };
  social: {
    facebook: string;
    github: string;
    instagram: string;
    linkedin: string;
    x: string;
    youtube: string;
  };
  contactAction: string;
  /** hCaptcha site key. Leave empty to disable the captcha on the contact form. */
  hcaptchaSiteKey: string;
  seo: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    themeColor: string;
    twitterSite?: string;
  };
};

export const siteConfig = {
  locale: "en-US",
  url: "https://example.com",
  business: {
    name: "Evergreen Local Services",
    legalName: "Evergreen Local Services LLC",
    tagline: "Reliable work from a local team.",
    taglineShort: "Reliable local services",
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
    github: "",
    instagram: "",
    linkedin: "",
    x: "",
    youtube: "",
  },
  contactAction: "",
  hcaptchaSiteKey: "",
  seo: {
    title: "Evergreen Local Services | Local Service Business",
    description:
      "A fast, SEO-friendly starter website for local service businesses.",
    image: "/images/hero.svg",
    imageAlt: "Illustration of a local service business at work",
    themeColor: "#2f7662",
    twitterSite: undefined,
  },
} satisfies SiteConfig;
