/*** Vitest setup - jest-dom matchers + safe browser stubs ***/
import '@testing-library/jest-dom/vitest';

class MockWebSocket {
  url: string;
  readyState = 0;
  onopen: ((e: Event) => void) | null = null;
  onclose: ((e: CloseEvent) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  onmessage: ((e: MessageEvent) => void) | null = null;
  constructor(url: string) {
    this.url = url;
  }
  send() {}
  close() {}
}

(globalThis as unknown as { WebSocket: typeof MockWebSocket }).WebSocket =
  MockWebSocket;

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (q: string) => ({
      matches: false,
      media: q,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
