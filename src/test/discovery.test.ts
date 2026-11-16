import { describe, it, expect } from 'vitest';
import { gcashMerchant, matchesSearch } from '../lib/discovery';
import { initialJobs } from '../lib/kanto';
describe('Job search', () => {
  it('matches a submitted trimmed query without case sensitivity', () => {
    expect(initialJobs.filter(j=>matchesSearch(j,'  SOFA  ')).map(j=>j.id)).toEqual([2]);
    expect(initialJobs.filter(j=>matchesSearch(j,'not-a-real-gig'))).toEqual([]);
  });
});
describe('GCash merchant', () => {
  it('uses Jonel M’s designated recipient', () => {
    expect(gcashMerchant.number).toBe('09241748668');
    expect(gcashMerchant.name).toBe('Jonel M');
  });
});