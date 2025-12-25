import { USERS_URL, USERS_CACHE_TTL } from '../config/env';

let cache: { data: any; expiresAt: number } | null = null;

export async function getUsers(): Promise<any[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.data;

  // Timeout using AbortController (5s)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const resp = await fetch(USERS_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!resp.ok) throw new Error(`Upstream responded with ${resp.status}`);
    const users = await resp.json();
    cache = { data: users, expiresAt: Date.now() + USERS_CACHE_TTL };
    return users;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}
