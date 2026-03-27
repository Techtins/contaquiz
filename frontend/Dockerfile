FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# Development
FROM base AS dev
RUN npm ci
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build
FROM base AS build
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Production
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./
EXPOSE 3000
CMD ["npm", "start"]
