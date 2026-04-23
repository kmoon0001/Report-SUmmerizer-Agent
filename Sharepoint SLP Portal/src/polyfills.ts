/**
 * Essential Polyfills for Node.js Environment
 * This file MUST be imported before any clinical or library services.
 */

// Fix for pdf-parse / browser-based libs expecting DOMMatrix
if (typeof (global as any).DOMMatrix === 'undefined') {
  (global as any).DOMMatrix = class DOMMatrix {
    a: number = 1; b: number = 0; c: number = 0; d: number = 1; e: number = 0; f: number = 0;
    constructor() {}
    static fromFloat32Array() { return new DOMMatrix(); }
    static fromFloat64Array() { return new DOMMatrix(); }
  };
}

console.log("[Polyfill] DOMMatrix initialized.");
