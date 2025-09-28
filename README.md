# Node API

This is a simple Node.js API built with Express.js.

## Installation

You need to have Docker and Docker Compose installed on your machine.

1. Create a `docker-compose.yml` file with the following content:

```yaml
services:
  my-node-api:
    image: jorcalle11/node-api:latest
    container_name: my-node-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: node-api-db
      DB_PORT: 3306
      DB_USER: "root"
      DB_PASSWORD: "123456"
      DB_NAME: "my_database"
    depends_on:
      - node-api-db

  node-api-db:
    image: mysql:9.4.0
    container_name: node-api-db
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_DATABASE=my_database
      - MYSQL_USER=root
      - MYSQL_PASSWORD=123456
    ports:
      - "3306:3306"
    volumes:
      - db/data:/var/lib/mysql
```

2. Run the following command to start the service:

```bash
docker compose up -d
```

3. The API will be accessible at [http://localhost:3000](http://localhost:3000).

4. To check the logs, use:

```bash
docker logs -f my-node-api
```

5. To stop the service, run:

```bash
docker compose down
```

## Endpoints

- `GET /`: Returns a welcome message.
- `GET /health`: Returns the health status of the API.

## Run from Source

1. Clone the repository:

```bash
git clone https://github.com/jorcalle11/node-api.git
cd node-api
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run prod
```

4. The API will be accessible at [http://localhost:3000](http://localhost:3000).

5. To stop the server, run:

```bash
npm run prod-stop
```

## Run from source in development mode

1. Start the server in development mode:

```bash
npm run dev
```

2. The API will be accessible at [http://localhost:4000](http://localhost:4000).

3. To stop the server, run:

```bash
npm run dev-stop
```
