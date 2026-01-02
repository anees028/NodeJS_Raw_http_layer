import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000').transform((val) => Number(val)),
  API_KEY: z.string().default('toni'),
  USERS_URL: z.string().default('https://jsonplaceholder.typicode.com/users'),
  USERS_CACHE_TTL: z.string().default('60000').transform((s) => Number(s)),
  FETCH_TIMEOUT_MS: z.string().default('5000').transform((s) => Number(s)),
});

export const env = envSchema.parse(process.env);
export const PORT = env.PORT;
export const API_KEY = env.API_KEY;
export const USERS_URL = env.USERS_URL;
export const USERS_CACHE_TTL = env.USERS_CACHE_TTL;
export const FETCH_TIMEOUT_MS = env.FETCH_TIMEOUT_MS;