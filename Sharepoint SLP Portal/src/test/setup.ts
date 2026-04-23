import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

// Mock fetch globally to prevent Invalid URL errors in tests
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(""),
});

// Mock lucide-react globally to prevent missing icon exports
vi.mock("lucide-react", async (importOriginal) => {
  const actual = (await importOriginal()) as any;

  // Use a Proxy to handle any missing icons that might have been renamed or are missing in specific versions
  const mockIcons = new Proxy(
    { ...actual },
    {
      get: (target, prop: string) => {
        // If the property is a PascalCase string (usually an Icon), wrap it to provide a data-testid
        if (typeof prop === "string" && /^[A-Z]/.test(prop)) {
          const Icon = target[prop];
          return (props: any) => {
            // Create a real element using React to avoid Symbol mismatches
            return React.createElement(Icon || "div", {
              ...props,
              "data-testid": `${prop.toLowerCase()}-icon`,
            });
          };
        }
        return target[prop];
      },
    },
  );

  return mockIcons;
});

// Mock matchMedia for components that use it (like Recharts or Tailwind responsive hooks)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for Recharts and other responsive components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock DOMMatrix for pdfjs-dist
global.DOMMatrix = class DOMMatrix {
  a = 1;
  b = 0;
  c = 0;
  d = 1;
  e = 0;
  f = 0;
  m11 = 1;
  m12 = 0;
  m13 = 0;
  m14 = 0;
  m21 = 0;
  m22 = 1;
  m23 = 0;
  m24 = 0;
  m31 = 0;
  m32 = 0;
  m33 = 1;
  m34 = 0;
  m41 = 0;
  m42 = 0;
  m43 = 0;
  m44 = 1;
  is2D = true;
  isIdentity = true;
  constructor(_init?: string | number[]) {}
  multiply() {
    return this;
  }
  translate() {
    return this;
  }
  scale() {
    return this;
  }
  rotate() {
    return this;
  }
  transformPoint() {
    return { x: 0, y: 0, z: 0, w: 1 };
  }
  toFloat32Array() {
    return new Float32Array(16);
  }
  toFloat64Array() {
    return new Float64Array(16);
  }
  toJSON() {
    return {};
  }
  toString() {
    return "";
  }
  invertSelf() {
    return this;
  }
  multiplySelf() {
    return this;
  }
  preMultiplySelf() {
    return this;
  }
  translateSelf() {
    return this;
  }
  scaleSelf() {
    return this;
  }
  scaleNonUniformSelf() {
    return this;
  }
  rotateSelf() {
    return this;
  }
  rotateFromVectorSelf() {
    return this;
  }
  rotateAxisAngleSelf() {
    return this;
  }
  skewXSelf() {
    return this;
  }
  skewYSelf() {
    return this;
  }
  setMatrixValue() {
    return this;
  }
} as any;

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock Worker for JSDOM
if (typeof global.Worker === "undefined") {
  global.Worker = class {
    onmessage = null;
    onerror = null;
    postMessage() {}
    terminate() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() {
      return true;
    }
  } as any;
}
