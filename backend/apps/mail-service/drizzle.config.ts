import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.MAIL_DATABASE_URL || process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5434/cs_mail',
  },
});
