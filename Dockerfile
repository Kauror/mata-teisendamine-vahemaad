ARG NODE_IMAGE=node:22.23.1-alpine3.23@sha256:8516dce0483394d5708d4b2ee6cacb79fb1d617ea4e2787c2120bcca92ce372e

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
# The calendar version is derived from the last commit date, but .git is kept out
# of the build context, so the host computes it and passes it in. The build fails
# rather than shipping a wrong "last updated" date if this is missing.
ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}
ENV MATHS_GAME_DB_FILE=:memory:
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
# npm, Corepack and Yarn are build tools and are not used by the runtime entry
# point. Removing them keeps their transitive packages out of the production
# image and reduces both its attack surface and vulnerability noise.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /opt/yarn-v1.22.22 \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg /usr/local/bin/pnpm /usr/local/bin/pnpx \
    && mkdir -p /data \
    && chown node:node /data
COPY --from=builder /app/.next ./.next
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
# The verified startup workflow (tsx scripts/verified-start.ts) runs at
# container boot: it asserts auth config, backs up and verifies the
# SQLite database, then launches Next. Its scripts must exist in the image.
COPY --from=builder /app/scripts ./scripts
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["./node_modules/.bin/tsx", "scripts/verified-start.ts"]
