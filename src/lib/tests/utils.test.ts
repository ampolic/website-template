import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("returns a single class unchanged", () => {
    expect(cn("px-4")).toBe("px-4");
  });

  it("merges multiple class strings", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("resolves conflicting Tailwind utilities — last wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("includes classes when condition is true", () => {
    expect(cn("base", { active: true })).toBe("base active");
  });

  it("excludes classes when condition is false", () => {
    expect(cn("base", { active: false })).toBe("base");
  });

  it("handles mixed conditional and static classes", () => {
    expect(cn("base", { active: true, disabled: false }, "extra")).toBe(
      "base active extra",
    );
  });

  it("handles undefined and null without throwing", () => {
    expect(cn("base", undefined, null as unknown as string)).toBe("base");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});
