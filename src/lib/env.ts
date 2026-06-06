/// <reference types="vite/client" />
import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1),
  VITE_API_BASE_URL: z.string().url(),
  VITE_OIDC_AUTHORITY: z.string().url(),
  VITE_OIDC_CLIENT_ID: z.string().min(1),
  VITE_OIDC_REDIRECT_URI: z.string().url(),
  VITE_OIDC_POST_LOGOUT_REDIRECT_URI: z.string().url(),
  VITE_OIDC_SCOPE: z.string().default('openid profile email groups'),
  VITE_OIDC_RESPONSE_TYPE: z.string().default('code'),
  VITE_JWT_GROUPS_CLAIM: z.string().default('groups'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  throw new Error('Missing or invalid environment variables. Check .env file.');
}

export const env = parsed.data;
