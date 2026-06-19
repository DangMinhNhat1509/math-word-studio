/**
 * Debounce function to prevent race conditions
 * Delays execution until no more calls are made within the specified delay
 */
export function createDebounce(fn, delay = 300) {
  let timeoutId = null;

  return function debounced(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle function to limit execution frequency
 */
export function createThrottle(fn, delay = 300) {
  let lastCallTime = 0;

  return function throttled(...args) {
    const now = Date.now();

    if (now - lastCallTime >= delay) {
      fn(...args);
      lastCallTime = now;
    }
  };
}
