#!/bin/sh
set -eu

cat >/usr/share/nginx/html/assets/js/runtime-config.js <<EOF
window.__UNISYNC_API_BASE_URL__ = '${UNISYNC_API_BASE_URL:-http://localhost:3000}';
EOF
