import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit,
  ) {}
}

global.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;
