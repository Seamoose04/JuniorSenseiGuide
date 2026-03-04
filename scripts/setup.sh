#!/bin/bash
set -e

# load env vars
source .env.local

# Setup superuser
./services/pocketbase/pocketbase superuser upsert "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASSWORD"
echo superuser created.

# Apply database migrations
./services/pocketbase/pocketbase migrate up
echo setup complete!
