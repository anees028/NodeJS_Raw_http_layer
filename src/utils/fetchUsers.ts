import { USERS_URL, USERS_CACHE_TTL, FETCH_TIMEOUT_MS } from '../config/env';

let cache: { data: any; expiresAt: number } | null = null;

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return resp;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

export async function getUsers(): Promise<any[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.data;

  const resp = await fetchWithTimeout(USERS_URL, FETCH_TIMEOUT_MS);
  if (!resp.ok) throw new Error(`Upstream responded with ${resp.status}`);
  const users = await resp.json();
  cache = { data: users, expiresAt: Date.now() + USERS_CACHE_TTL };
  return users;
}

export async function getUserById(id: number): Promise<any> {
  // Fetch a single user directly (no caching per-id here; could be added)
  const resp = await fetchWithTimeout(`${USERS_URL}/${id}`, FETCH_TIMEOUT_MS);
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error(`Upstream responded with ${resp.status}`);
  return resp.json();
}
