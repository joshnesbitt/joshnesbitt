import { describe, expect, it } from 'vitest';
import { parseCount, trackableKeys } from '../../src/utils/views';

describe('trackableKeys', () => {
  const keys = trackableKeys({ thoughts: ['consistency'], reviews: ['2025'] });

  it('includes the site pages TrackView reports', () => {
    expect(keys).toContain('site:home');
    expect(keys).toContain('site:speaking');
    expect(keys).toContain('site:not-found');
    expect(keys).toContain('thoughts:index');
    expect(keys).toContain('reviews:index');
  });

  it('includes each content entry under its namespace', () => {
    expect(keys).toContain('thoughts:consistency');
    expect(keys).toContain('reviews:2025');
  });

  it('rejects keys for pages that do not exist', () => {
    expect(keys).not.toContain('thoughts:2025');
    expect(keys).not.toContain('site:consistency');
    expect(keys).not.toContain('anything');
    expect(keys).not.toContain('');
  });
});

describe('parseCount', () => {
  it('parses stored counts', () => {
    expect(parseCount('42')).toBe(42);
  });

  it('treats missing, corrupt, negative, and oversized values as zero', () => {
    expect(parseCount(null)).toBe(0);
    expect(parseCount(undefined)).toBe(0);
    expect(parseCount('')).toBe(0);
    expect(parseCount('abc')).toBe(0);
    expect(parseCount('-5')).toBe(0);
    expect(parseCount('9'.repeat(30))).toBe(0);
  });
});
