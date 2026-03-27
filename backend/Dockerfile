FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# Development
FROM base AS dev
RUN npm ci
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Build
FROM base AS build
RUN npm ci
COPY . .
RUN npx tsc

# Production
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
