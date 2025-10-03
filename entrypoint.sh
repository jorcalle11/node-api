#! /bin/sh

# Stop execution if a command fails
set -e

log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')][entrypoint.sh] $1"
}


log "Starting entrypoint script..."
log "Waiting for MySQL at $DB_HOST:$DB_PORT..."

# Keep checking until DB is reachable
until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

log "MySQL is up"

# Run database migrations
log "Running migrations..."
npm run migrate

log "Starting $NODE_ENV server..."
# Run whatever command Docker passes in (as CMD in Dockerfile or command in docker-compose)
exec "$@"