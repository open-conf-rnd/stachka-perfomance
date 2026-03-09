#!/bin/sh
set -e
envsubst '${DOMAIN}' < /etc/caddy/Caddyfile.template > /etc/caddy/Caddyfile
exec caddy run --config /etc/caddy/Caddyfile
