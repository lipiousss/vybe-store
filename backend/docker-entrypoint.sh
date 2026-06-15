#!/bin/sh
set -e

echo "Generating Prisma client..."
npm run prisma:generate

echo "Applying Prisma migrations..."
npm run prisma:migrate

if [ "$RUN_SEED_ON_START" = "true" ]; then
  echo "RUN_SEED_ON_START=true, running seed script..."
  npm run prisma:seed
else
  echo "RUN_SEED_ON_START is not true, skipping seed."
fi

exec "$@"
