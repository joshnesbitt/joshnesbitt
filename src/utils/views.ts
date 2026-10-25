// View counts are keyed `namespace:key`, matching what TrackView posts.
// Only keys for pages that exist are accepted, so the store can't be
// filled with arbitrary entries.

const SITE_KEYS = ['home', 'speaking', 'not-found'];

export interface ContentIds {
  thoughts: string[];
  reviews: string[];
}

export function trackableKeys({ thoughts, reviews }: ContentIds): Set<string> {
  return new Set([
    ...SITE_KEYS.map((key) => `site:${key}`),
    'thoughts:index',
    'reviews:index',
    ...thoughts.map((id) => `thoughts:${id}`),
    ...reviews.map((id) => `reviews:${id}`),
  ]);
}

export function parseCount(value: string | null | undefined): number {
  const count = Number.parseInt(value ?? '', 10);

  return Number.isSafeInteger(count) && count > 0 ? count : 0;
}
