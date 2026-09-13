export function useHaptic() {
  return (pattern: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const patterns: Record<string, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 40,
        success: [10, 30, 10],
        warning: [20, 40, 20],
        error: [40, 80, 40, 80, 40],
      };
      navigator.vibrate(patterns[pattern]);
    }
  };
}
