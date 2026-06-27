type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

// Purge expired entries every 10 minutes to prevent unbounded memory growth.
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of buckets.entries()) {
            if (entry.resetAt <= now) buckets.delete(key);
        }
    }, CLEANUP_INTERVAL_MS);
}

function getClientKey(request: Request, scope: string): string {
    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const realIp = request.headers.get('x-real-ip')?.trim();
    return `${scope}:${forwardedFor || realIp || 'unknown'}`;
}

export function rateLimit(
    request: Request,
    options: { scope: string; limit: number; windowMs: number }
): Response | null {
    const key = getClientKey(request, options.scope);
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + options.windowMs });
        return null;
    }

    existing.count += 1;
    if (existing.count <= options.limit) {
        return null;
    }

    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    return Response.json(
        { error: 'Too many requests. Please try again later.' },
        {
            status: 429,
            headers: {
                'Retry-After': String(retryAfter),
            },
        }
    );
}
