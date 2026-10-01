if (
  typeof globalThis.crypto === 'undefined' ||
  typeof globalThis.crypto.randomUUID !== 'function'
) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      ...(globalThis.crypto || {}),
      randomUUID: () =>
        Math.random().toString(36).slice(2, 15) +
        Math.random().toString(36).slice(2, 15)
    },
    writable: true,
    configurable: true
  });
}
