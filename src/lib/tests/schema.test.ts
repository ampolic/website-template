import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/site", () => ({
  siteConfig: {
    url: "https://test.example.com",
    business: {
      name: "Test Business",
      legalName: "Test Business LLC",
      description: "A test business description.",
      phone: "(555) 000-0000",
      email: "hello@test.example.com",
      address: {
        street: "123 Main St",
        city: "Testville",
        region: "OH",
        postalCode: "43000",
        country: "United States",
      },
      hours: ["Mo-Fr 09:00-17:00"],
    },
    serviceAreas: ["Ohio", "United States"],
    social: {
      facebook: "https://facebook.com/test",
      github: "",
      instagram: "",
      linkedin: "https://linkedin.com/company/test",
      x: "",
      youtube: "",
    },
    seo: {
      image: "/images/hero.jpg",
    },
  },
}));

import {
  getBlogPostingSchema,
  getBreadcrumbSchema,
  getFAQPageSchema,
  getLocalBusinessSchema,
  getServiceSchema,
} from "@/lib/schema";

// schema-dts uses complex discriminated union types that TypeScript cannot
// narrow through bracket notation. Cast once at the call site for readability.
type PlainSchema = Record<string, unknown>;

describe("getLocalBusinessSchema", () => {
  it("sets the correct @context and @type", () => {
    const schema = getLocalBusinessSchema() as unknown as PlainSchema;
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("LocalBusiness");
  });

  it("includes name, legalName, and description from config", () => {
    const schema = getLocalBusinessSchema() as unknown as PlainSchema;
    expect(schema.name).toBe("Test Business");
    expect(schema.legalName).toBe("Test Business LLC");
    expect(schema.description).toBe("A test business description.");
  });

  it("builds the url from the site base", () => {
    const schema = getLocalBusinessSchema() as unknown as PlainSchema;
    expect(schema.url).toBe("https://test.example.com/");
  });

  it("includes telephone and email when set", () => {
    const schema = getLocalBusinessSchema() as unknown as PlainSchema;
    expect(schema.telephone).toBe("(555) 000-0000");
    expect(schema.email).toBe("hello@test.example.com");
  });

  it("includes opening hours", () => {
    const schema = getLocalBusinessSchema() as unknown as PlainSchema;
    expect(schema.openingHours).toEqual(["Mo-Fr 09:00-17:00"]);
  });

  it("filters empty social links from sameAs", () => {
    const schema = getLocalBusinessSchema() as unknown as PlainSchema;
    const sameAs = schema.sameAs as string[];
    expect(sameAs).toContain("https://facebook.com/test");
    expect(sameAs).toContain("https://linkedin.com/company/test");
    expect(sameAs.every(Boolean)).toBe(true);
  });

  it("accepts an explicit site URL override", () => {
    const schema = getLocalBusinessSchema(
      new URL("https://staging.example.com"),
    ) as unknown as PlainSchema;
    expect(schema.url).toBe("https://staging.example.com/");
  });
});

describe("getServiceSchema", () => {
  it("sets the correct @type", () => {
    const schema = getServiceSchema({
      name: "Web Design",
      description: "Custom website builds.",
      url: "/services/web-design",
    }) as unknown as PlainSchema;
    expect(schema["@type"]).toBe("Service");
  });

  it("includes name, description, and absolute url", () => {
    const schema = getServiceSchema({
      name: "SEO",
      description: "Search engine optimisation.",
      url: "/services/seo",
    }) as unknown as PlainSchema;
    expect(schema.name).toBe("SEO");
    expect(schema.description).toBe("Search engine optimisation.");
    expect(schema.url).toBe("https://test.example.com/services/seo");
  });

  it("sets provider to the business", () => {
    const schema = getServiceSchema({
      name: "SEO",
      description: "desc",
      url: "/seo",
    }) as unknown as PlainSchema;
    const provider = schema.provider as { name: string };
    expect(provider.name).toBe("Test Business");
  });
});

describe("getBreadcrumbSchema", () => {
  it("sets the correct @type", () => {
    const schema = getBreadcrumbSchema([
      { name: "Home", path: "/" },
    ]) as unknown as PlainSchema;
    expect(schema["@type"]).toBe("BreadcrumbList");
  });

  it("generates one ListItem per breadcrumb with correct positions", () => {
    const schema = getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Our Work", path: "/our-work" },
    ]) as unknown as PlainSchema;
    const items = schema.itemListElement as Array<{
      "@type": string;
      position: number;
      name: string;
      item: string;
    }>;
    expect(items).toHaveLength(2);
    expect(items[0].position).toBe(1);
    expect(items[0].name).toBe("Home");
    expect(items[1].position).toBe(2);
    expect(items[1].name).toBe("Our Work");
    expect(items[1].item).toBe("https://test.example.com/our-work");
  });
});

describe("getBlogPostingSchema", () => {
  const publishDate = new Date("2025-01-15T00:00:00.000Z");
  const updatedDate = new Date("2025-02-01T00:00:00.000Z");

  it("sets the correct @type", () => {
    const schema = getBlogPostingSchema({
      title: "Test Post",
      description: "A post.",
      url: "/blog/test",
      publishDate,
      author: "Jane Smith",
    }) as unknown as PlainSchema;
    expect(schema["@type"]).toBe("BlogPosting");
  });

  it("formats dates as ISO strings", () => {
    const schema = getBlogPostingSchema({
      title: "Test Post",
      description: "A post.",
      url: "/blog/test",
      publishDate,
      author: "Jane Smith",
    }) as unknown as PlainSchema;
    expect(schema.datePublished).toBe("2025-01-15T00:00:00.000Z");
    expect(schema.dateModified).toBe("2025-01-15T00:00:00.000Z");
  });

  it("uses updatedDate for dateModified when provided", () => {
    const schema = getBlogPostingSchema({
      title: "Test Post",
      description: "A post.",
      url: "/blog/test",
      publishDate,
      updatedDate,
      author: "Jane Smith",
    }) as unknown as PlainSchema;
    expect(schema.dateModified).toBe("2025-02-01T00:00:00.000Z");
  });

  it("includes image as absolute url when provided", () => {
    const schema = getBlogPostingSchema({
      title: "Test Post",
      description: "A post.",
      url: "/blog/test",
      publishDate,
      author: "Jane Smith",
      image: "/images/post.jpg",
    }) as unknown as PlainSchema;
    expect(schema.image).toBe("https://test.example.com/images/post.jpg");
  });

  it("omits image when not provided", () => {
    const schema = getBlogPostingSchema({
      title: "Test Post",
      description: "A post.",
      url: "/blog/test",
      publishDate,
      author: "Jane Smith",
    }) as unknown as PlainSchema;
    expect(schema.image).toBeUndefined();
  });
});

describe("getFAQPageSchema", () => {
  it("sets the correct @type", () => {
    const schema = getFAQPageSchema([
      { question: "What do you do?", answer: "We build websites." },
    ]) as unknown as PlainSchema;
    expect(schema["@type"]).toBe("FAQPage");
  });

  it("creates one Question entity per item", () => {
    const schema = getFAQPageSchema([
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ]) as unknown as PlainSchema;
    const entities = schema.mainEntity as Array<{
      "@type": string;
      name: string;
      acceptedAnswer: { "@type": string; text: string };
    }>;
    expect(entities).toHaveLength(2);
    expect(entities[0]["@type"]).toBe("Question");
    expect(entities[0].name).toBe("Q1?");
    expect(entities[0].acceptedAnswer["@type"]).toBe("Answer");
    expect(entities[0].acceptedAnswer.text).toBe("A1.");
  });
});
