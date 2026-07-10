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
    name: "Evergreen Lawn & Landscape",
    legalName: "Evergreen Lawn & Landscape LLC",
    tagline: "Lawns that look cared for — because they are.",
    taglineShort: "Lawn care & landscaping",
    description:
      "Family-owned lawn care and landscaping serving the Springfield area since 2012. Weekly mowing, fertilization programs, cleanups, and landscape projects — done on schedule, every time.",
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
    title: "Evergreen Lawn & Landscape | Lawn Care in Springfield, IL",
    description:
      "Weekly mowing, fertilization, cleanups, and landscaping for Springfield-area homes and businesses. Free estimates, no long-term contracts.",
    image: "/images/hero.svg",
    imageAlt:
      "Freshly mowed lawn with crisp stripes in front of a well-kept home",
    themeColor: "#2f7662",
    twitterSite: undefined,
  },
} satisfies SiteConfig;
