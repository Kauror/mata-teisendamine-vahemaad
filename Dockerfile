ARG NODE_IMAGE=node:22.22.3-alpine3.23

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM ${NODE_IMAGE} AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

FROM ${NODE_IMAGE} AS builder
WORKDIR /app
ENV MATHS_GAME_DB_FILE=:memory:
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir -p /data && chown node:node /data
COPY --from=builder /app/.next ./.next
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
# The verified startup workflow (npm start -> tsx scripts/verified-start.ts)
# runs at container boot: it asserts auth config, backs up and verifies the
# SQLite database, then launches Next. Its scripts must exist in the image.
COPY --from=builder /app/scripts ./scripts
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["./node_modules/.bin/tsx", "scripts/verified-start.ts"]
