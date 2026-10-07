const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS = 5;
const attempts = new Map();
let lastCleanup = Date.now();

function allowContactSubmission(ipAddress, now = Date.now()) {
  if (now - lastCleanup > WINDOW_MS) {
    for (const [ip, entry] of attempts) {
      if (now - entry.startedAt >= WINDOW_MS) attempts.delete(ip);
    }
    lastCleanup = now;
  }

  const ip = ipAddress || 'unknown';
  const existing = attempts.get(ip);
  if (!existing || now - existing.startedAt >= WINDOW_MS) {
    attempts.set(ip, { startedAt: now, count: 1 });
    return { allowed: true };
  }
  if (existing.count >= MAX_SUBMISSIONS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((WINDOW_MS - (now - existing.startedAt)) / 1000) };
  }

  existing.count += 1;
  return { allowed: true };
}

module.exports = { allowContactSubmission, WINDOW_MS, MAX_SUBMISSIONS };
