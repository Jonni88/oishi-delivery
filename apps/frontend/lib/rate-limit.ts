const bucket = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const current = bucket.get(key);
  if (!current || now > current.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  current.count += 1;
  if (current.count > limit) return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  return { ok: true };
}
