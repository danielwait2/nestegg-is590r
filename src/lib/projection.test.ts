import { describe, it, expect } from 'vitest';
import { calcProjection } from './projection';

describe('calcProjection', () => {
  it('returns 0 when monthly contribution is 0', () => {
    expect(calcProjection(0, 18)).toBe(0);
  });

  it('returns 0 when years is 0', () => {
    expect(calcProjection(200, 0)).toBe(0);
  });

  it('standard case: $200/month for 18 years at 7% compounds to ~$86,144', () => {
    const result = calcProjection(200, 18, 0.07);
    expect(result).toBeCloseTo(86144.21, 0);
  });

  it('zero rate produces linear growth (no compounding)', () => {
    // 100/mo * 10 years * 12 months = 12000
    const result = calcProjection(100, 10, 0);
    expect(result).toBe(12000);
  });

  it('short term: $200/month for 1 year at 7% is ~$2,479', () => {
    const result = calcProjection(200, 1, 0.07);
    expect(result).toBeCloseTo(2478.52, 0);
  });

  it('high contribution: $1,000/month for 18 years at 7% is ~$430,721', () => {
    const result = calcProjection(1000, 18, 0.07);
    expect(result).toBeCloseTo(430721.03, 0);
  });

  it('uses default 7% annual rate when called with only 2 arguments', () => {
    const withDefault = calcProjection(200, 18);
    const withExplicit = calcProjection(200, 18, 0.07);
    expect(withDefault).toBe(withExplicit);
  });

  it('1 month: contribution is returned as-is (effectively no compounding in one period)', () => {
    // For 1 month: FV = PMT * ((1 + r)^1 - 1) / r ≈ PMT
    const result = calcProjection(500, 1 / 12, 0.07);
    expect(result).toBeCloseTo(500, 0);
  });

  it('returns a finite positive number for all positive inputs', () => {
    const result = calcProjection(150, 5, 0.06);
    expect(result).toBeGreaterThan(0);
    expect(isFinite(result)).toBe(true);
  });

  it('higher rate produces a larger result than a lower rate for same contribution and time', () => {
    const low = calcProjection(200, 18, 0.05);
    const high = calcProjection(200, 18, 0.10);
    expect(high).toBeGreaterThan(low);
  });

  it('longer time horizon produces a larger result than shorter for same contribution and rate', () => {
    const short = calcProjection(200, 10, 0.07);
    const long = calcProjection(200, 18, 0.07);
    expect(long).toBeGreaterThan(short);
  });
});
