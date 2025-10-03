
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./


## For development
FROM base AS dev

# Install all dependencies (including dev)
RUN npm install

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD [ "npm", "run", "dev-server" ]


## For production
FROM base AS prod

# Install only production dependencies
RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Use an entrypoint script to run migrations before starting the app
ENTRYPOINT [ "sh", "entrypoint.sh" ]

CMD [ "node" , "src/index.js" ]