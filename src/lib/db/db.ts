import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';

config({ path: '.env.local' });
config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Add it to .env.local or .env before running the app.');
}

export const db = drizzle(databaseUrl);