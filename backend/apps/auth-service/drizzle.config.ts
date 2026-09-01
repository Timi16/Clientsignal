import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5434/cs_auth',
  },
});
