# wreislab-react-template

React/Vite frontend template for WReisLab — OIDC login via Pocket ID (Authorization Code + PKCE), JWT Bearer token calls to NestJS backend, RBAC by groups.

## Stack

| Layer | Library |
|---|---|
| Framework | React 18 + Vite 5 |
| Auth | oidc-client-ts (PKCE) |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5 |
| HTTP client | ky |
| UI base | shadcn/ui |
| UI accent | 8bitcn/ui (pixel art components) |
| Env validation | zod |
| Tests | Vitest + React Testing Library |

## Quick Start

```bash
cp .env.example .env
# Edit .env with your values
pnpm install
pnpm dev
```

App runs at `http://localhost:5173`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_APP_NAME` | required | App display name |
| `VITE_API_BASE_URL` | `http://localhost:3000` | NestJS backend URL |
| `VITE_OIDC_AUTHORITY` | required | Pocket ID base URL |
| `VITE_OIDC_CLIENT_ID` | required | OIDC client ID |
| `VITE_OIDC_REDIRECT_URI` | required | Callback URL after login |
| `VITE_OIDC_POST_LOGOUT_REDIRECT_URI` | required | Redirect after logout |
| `VITE_OIDC_SCOPE` | `openid profile email groups` | Requested OIDC scopes |
| `VITE_OIDC_RESPONSE_TYPE` | `code` | Always `code` for PKCE |
| `VITE_JWT_GROUPS_CLAIM` | `groups` | JWT claim name for groups |

> **IMPORTANT:** Vite bakes `VITE_*` variables into the JS bundle at **build time**. They are not runtime environment variables. For Docker deployments, pass them as `ARG` in the Dockerfile or `build.args` in docker-compose.

## Pocket ID Configuration

### Client setup

In Pocket ID admin panel, configure the `wreislab-react-template` OIDC client:

```
Redirect URIs (local):       http://localhost:5173/auth/callback
Redirect URIs (production):  https://react-template.wreislab.com/auth/callback
Post-logout redirect (local): http://localhost:5173
Post-logout redirect (prod):  https://react-template.wreislab.com
PKCE:                        enabled
client_secret:               NOT used — SPA uses PKCE only
```

### Scopes

Scopes are requested by the frontend in the authorization URL:
```
openid profile email groups
```

Pocket ID does not need a visual scope field configured — the client sends the scope request.

### Groups

Create groups in Pocket ID: `admin`, `user`, `viewer`. Assign your user to at least `admin`.

## Authorization Code + PKCE Flow

```
1. User clicks "Login with Pocket ID"
2. React generates code_verifier + code_challenge (PKCE)
3. User redirected to https://auth.wreislab.com/authorize
4. User authenticates with Pocket ID
5. Pocket ID redirects to /auth/callback?code=...
6. React exchanges code for tokens at /api/oidc/token
7. access_token stored in memory/localStorage
8. React calls NestJS APIs with Authorization: Bearer <token>
9. NestJS validates token via JWKS and enforces RBAC
```

No `client_secret` is ever sent from the browser.

## Pages

| Route | Description | Auth |
|---|---|---|
| `/` | Home page | Public |
| `/login` | Login with Pocket ID button | Public |
| `/auth/callback` | OIDC callback handler | Public |
| `/profile` | User profile + backend verification | Protected |
| `/admin` | Admin panel + backend call | Protected + admin group |
| `/logout` | Sign out + OIDC end_session | Public |

## Running Tests

```bash
pnpm test           # single run
pnpm test:watch     # watch mode
```

Tests mock OIDC and env — no live Pocket ID connection needed.

## Testing the Login Flow

1. Start the backend: `cd ../wreislab-nestjs-template && pnpm dev`
2. Start the frontend: `pnpm dev`
3. Open `http://localhost:5173`
4. Click **Login with Pocket ID**
5. Authenticate at `https://auth.wreislab.com`
6. Should land on `/` after callback
7. Navigate to `/profile` — should show user claims and backend verification
8. Navigate to `/admin` — should succeed if you have `admin` group

## Integrating with Backend

The API client in `src/lib/api.ts` automatically:
- Injects `Authorization: Bearer <token>` on every request
- Attempts silent token renewal on 401 responses
- Propagates 403 errors to the calling component

## 8bitcn/ui

The pixel art button is in `src/components/ui/button-8bit.tsx`. It uses the `Press Start 2P` font loaded via Google Fonts in `index.html`.

To use it in other pages:
```tsx
import { Button8bit } from '@/components/ui/button-8bit';

<Button8bit variant="primary" size="md" onClick={handleClick}>
  Click me
</Button8bit>
```

Variants: `primary`, `secondary`, `destructive`  
Sizes: `sm`, `md`, `lg`

To add more 8bitcn components from the official registry:
```bash
pnpm dlx shadcn@latest add "https://8bitcn.com/r/<component>"
```

## Docker

### Build

**Important:** Pass all `VITE_*` vars as build args:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api-template.wreislab.com \
  --build-arg VITE_OIDC_AUTHORITY=https://auth.wreislab.com \
  --build-arg VITE_OIDC_CLIENT_ID=wreislab-react-template \
  --build-arg VITE_OIDC_REDIRECT_URI=https://react-template.wreislab.com/auth/callback \
  --build-arg VITE_OIDC_POST_LOGOUT_REDIRECT_URI=https://react-template.wreislab.com \
  --build-arg VITE_OIDC_SCOPE="openid profile email groups" \
  --build-arg VITE_JWT_GROUPS_CLAIM=groups \
  -t wreislab-react-template .
```

### Docker Compose

```bash
# Copy .env.example to .env and fill in values
cp .env.example .env
docker compose up
```

Served at `http://localhost:80`.

## Dokploy Deployment

```
Project/App:      wreislab-react-template
Build method:     Dockerfile
Dockerfile path:  Dockerfile
Port:             80

Build args (set in Dokploy UI):
  VITE_API_BASE_URL=https://api-template.wreislab.com
  VITE_OIDC_AUTHORITY=https://auth.wreislab.com
  VITE_OIDC_CLIENT_ID=wreislab-react-template
  VITE_OIDC_REDIRECT_URI=https://react-template.wreislab.com/auth/callback
  VITE_OIDC_POST_LOGOUT_REDIRECT_URI=https://react-template.wreislab.com
  VITE_OIDC_SCOPE=openid profile email groups
  VITE_JWT_GROUPS_CLAIM=groups

LAN access:  http://react-template.192.168.1.106.sslip.io
External:    https://react-template.wreislab.com
```

Remember to add the production redirect URIs to the Pocket ID client configuration.

## Cloudflare Tunnel

When using Cloudflare Tunnel, ensure all URLs are HTTPS. The OIDC `redirect_uri` must use the exact HTTPS domain exposed by the tunnel. Update `VITE_OIDC_REDIRECT_URI` in the Docker build args accordingly.

## Troubleshooting

### Callback error — invalid redirect URI
The callback URL in the browser must exactly match one of the registered Redirect URIs in Pocket ID. Include the trailing `/auth/callback` path.

### Authority/issuer mismatch
Decode the token at jwt.io and check the `iss` field. Update `VITE_OIDC_AUTHORITY` to match exactly.

### Token without groups
1. Check that `VITE_OIDC_SCOPE` includes `groups`
2. Verify user belongs to a group in Pocket ID
3. Check UserInfo endpoint: `GET https://auth.wreislab.com/api/oidc/userinfo` with Bearer token
4. Adjust `VITE_JWT_GROUPS_CLAIM` if the claim has a different name

### 401 from API
- Token may be expired — retry after refreshing the page
- Check `VITE_API_BASE_URL` points to the correct backend
- Backend `CORS_ORIGIN` must include the frontend URL

### 403 from API
- Valid token but user lacks the required group
- Check user's group membership in Pocket ID
- Verify backend `JWT_GROUPS_CLAIM` matches frontend `VITE_JWT_GROUPS_CLAIM`

### CORS error
- Set `CORS_ORIGIN=http://localhost:5173` on the backend (or the production frontend URL)
- Ensure `credentials: true` is set in backend CORS config

## Adapting This Template

To use this as a starting point for a new React SPA:

1. Update `VITE_APP_NAME` and `VITE_OIDC_CLIENT_ID` in `.env`
2. Register the new client in Pocket ID with the new redirect URIs
3. Add your pages in `src/pages/`
4. Add your API calls in `src/lib/queries.ts`
5. Use `ProtectedRoute` for authenticated routes
6. Use `RequireGroup` for group-restricted content
7. Update `src/App.tsx` with new routes
