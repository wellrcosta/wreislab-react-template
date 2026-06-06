#!/bin/sh
mkdir -p /usr/share/nginx/html/api
cat > /usr/share/nginx/html/api/config <<EOF
{
  "VITE_APP_NAME": "${VITE_APP_NAME:-WReisLab React Template}",
  "VITE_API_BASE_URL": "${VITE_API_BASE_URL:-}",
  "VITE_OIDC_AUTHORITY": "${VITE_OIDC_AUTHORITY:-}",
  "VITE_OIDC_CLIENT_ID": "${VITE_OIDC_CLIENT_ID:-}",
  "VITE_OIDC_REDIRECT_URI": "${VITE_OIDC_REDIRECT_URI:-}",
  "VITE_OIDC_POST_LOGOUT_REDIRECT_URI": "${VITE_OIDC_POST_LOGOUT_REDIRECT_URI:-}",
  "VITE_OIDC_SCOPE": "${VITE_OIDC_SCOPE:-openid profile email groups}",
  "VITE_OIDC_RESPONSE_TYPE": "${VITE_OIDC_RESPONSE_TYPE:-code}",
  "VITE_JWT_GROUPS_CLAIM": "${VITE_JWT_GROUPS_CLAIM:-groups}"
}
EOF
exec nginx -g 'daemon off;'
