/**
 * Computes the continued fraction expansion of a decimal number between 0 and 1.
 * Returns the coefficients [a1, a2, a3, a4, a5, a6...]
 * representing the fraction: 0 + 1 / (a1 + 1 / (a2 + 1 / (a3 + ...)))
 */
export function getContinuedFraction(value: number, maxTerms: number = 8): number[] {
  // Normalize value to [0, 1)
  let val = value % 1;
  if (val < 0) val += 1;

  const terms: number[] = [];
  const epsilon = 1e-7;

  let current = val;
  for (let i = 0; i < maxTerms; i++) {
    if (current < epsilon) {
      break;
    }
    const inv = 1 / current;
    const a = Math.floor(inv + epsilon); // add epsilon to avoid rounding issues like 2.9999999
    terms.push(a);
    current = inv - a;
    
    // If remainder is extremely close to 0, stop
    if (Math.abs(current) < epsilon) {
      break;
    }
  }

  return terms;
}

/**
 * Checks if a given number of spirals (Fibonacci number) is close to the parastichy count.
 * Standard Fibonacci numbers: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, etc.
 */
export const FIBONACCI_NUMBERS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

/**
 * Get nearest Fibonacci numbers for spiral analysis.
 */
export function getNearestFibonacci(n: number): { lower: number; upper: number } {
  let lower = 1;
  let upper = 1;
  for (let i = 0; i < FIBONACCI_NUMBERS.length; i++) {
    const f = FIBONACCI_NUMBERS[i];
    if (f <= n) {
      lower = f;
    }
    if (f >= n) {
      upper = f;
      break;
    }
  }
  return { lower, upper };
}

/**
 * Converts angle in degrees to divergence ratio (fraction of 360).
 */
export function getDivergenceRatio(angleDegrees: number): number {
  const ratio = (angleDegrees / 360) % 1;
  return ratio < 0 ? ratio + 1 : ratio;
}

export interface Convergent {
  p: number;
  q: number;
}

/**
 * Computes the rational convergents (p/q) from the continued fraction terms.
 * The denominators (q) represent the number of spiral arms (parastichy families)
 * that naturally form in the pattern.
 */
export function getConvergents(terms: number[]): Convergent[] {
  const convergents: Convergent[] = [];
  if (terms.length === 0) return convergents;

  let p0 = 0, q0 = 1;
  let p1 = 1, q1 = terms[0];

  convergents.push({ p: p1, q: q1 });

  for (let i = 1; i < terms.length; i++) {
    const a = terms[i];
    const p = a * p1 + p0;
    const q = a * q1 + q0;

    if (q > 100000) break;

    convergents.push({ p, q });
    p0 = p1;
    q0 = q1;
    p1 = p;
    q1 = q;
  }

  return convergents;
}

