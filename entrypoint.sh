#! /bin/sh

# Stop execution if a command fails
set -e

echo "⏳ Waiting for MySQL at $DB_HOST:$DB_PORT..."

# Keep checking until DB is reachable
until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "✅ MySQL is up"

# Run database migrations
echo "🏗️ Running migrations..."
npm run migrate

echo "🚀 Starting the dev server..."
# Run whatever command Docker passes in (as CMD in Dockerfile or command in docker-compose)
exec "$@"