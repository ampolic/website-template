import { describe, expect, it } from "vitest";

import { isCurrentHref } from "@/lib/nav-utils";

describe("isCurrentHref", () => {
  it("returns false for hash-only hrefs regardless of current path", () => {
    expect(isCurrentHref("/", "#about")).toBe(false);
    expect(isCurrentHref("/contact", "#contact")).toBe(false);
  });

  it("returns true for an exact path match", () => {
    expect(isCurrentHref("/our-work", "/our-work")).toBe(true);
    expect(isCurrentHref("/team", "/team")).toBe(true);
  });

  it("returns true when current path is a child of href", () => {
    expect(isCurrentHref("/our-work/ampolic", "/our-work")).toBe(true);
    expect(isCurrentHref("/team/dylan", "/team")).toBe(true);
  });

  it("returns false for unrelated paths", () => {
    expect(isCurrentHref("/team", "/our-work")).toBe(false);
    expect(isCurrentHref("/", "/team")).toBe(false);
  });

  it("does not treat a partial prefix as a match", () => {
    // /our-work-archive should not match /our-work
    expect(isCurrentHref("/our-work-archive", "/our-work")).toBe(false);
  });

  it("returns false when href is a deeper path than current", () => {
    expect(isCurrentHref("/our-work", "/our-work/ampolic")).toBe(false);
  });
});
