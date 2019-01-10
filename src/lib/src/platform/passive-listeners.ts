let supportsPassive;
export function supportsPassiveEventListeners(): boolean {
  if (supportsPassive === void 0) {
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: () => {
          supportsPassive = true;
        }
      });
      window.addEventListener('testPassive', null as any, opts);
      window.removeEventListener('testPassive', null as any, opts);
    } catch (e) { }
  }
  return supportsPassive;
}
