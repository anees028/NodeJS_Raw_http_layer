import { USERS_URL, USERS_CACHE_TTL } from '../config/env';

let cache: { data: any; expiresAt: number } | null = null;

export async function getUsers(): Promise<any[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.data;

  // Timeout using AbortController (5s)
  // Purpose: return cached users immediately if the cache exists and hasn't expired. 
  // This avoids the network call, reduces latency, and lowers upstream load.
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

export async function getUserById(userId: number): Promise<any> {
    try{
        const userDetail = await fetch(`${USERS_URL}/${userId}`);
        if (!userDetail.ok) throw new Error(`Upstream responded with ${userDetail.status}`);
        const user = await userDetail.json();
        return user;
    }
    catch(err){
        throw err;
    }
}
