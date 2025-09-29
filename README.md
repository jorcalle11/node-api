# Node API

This is a simple Node.js API built with Express.js.

## Installation

You need to have Docker and Docker Compose installed on your machine.

1. Create a directory of your choice (e.g., `node-api`) to hold the `docker-compose.yml` file and `.env` file. Navigate to that directory in your terminal.

```bash
mkdir node-api
cd node-api
```

2. Download the `docker-compose.yml` and `.env` by running the following commands:

```bash
# Download docker-compose.yml
curl -o docker-compose.yml https://raw.githubusercontent.com/jorcalle11/node-api/refs/heads/main/download/docker-compose.yml

# Download .env
curl -o .env https://raw.githubusercontent.com/jorcalle11/node-api/refs/heads/main/download/example.env
```

3. Edit the `.env` file to set your desired environment variables.

4. (optional) Create the database data directory specified in the `DB_DATA_PATH` variable in the `.env` file if it does not already exist:

```bash
mkdir -p ./db_data
```

5. Start the service using Docker Compose.

```bash
docker compose up -d
```

6. The API will be accessible at [http://localhost:3000](http://localhost:3000) (or the port you specified in the `.env` file).

7. To stop the service, run:

```bash
docker compose down
```

## Endpoints

- `GET /`: Returns a welcome message.
- `GET /health`: Returns the health status of the API.

## Installation from Source

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
