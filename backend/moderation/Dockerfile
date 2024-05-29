FROM node:20.12.0-alpine AS base

FROM base AS deps

RUN corepack enable
WORKDIR usr/src/app
COPY package.json pnpm-lock.yaml ./

RUN pnpm fetch --frozen-lockfile
RUN pnpm install --frozen-lockfile --prod

FROM base AS build

RUN corepack enable
WORKDIR usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch --frozen-lockfile
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base

WORKDIR usr/src/app
COPY --from=deps usr/src/app/node_modules ./node_modules
COPY --from=build usr/src/app/dist ./dist
ENV NODE_ENV production
CMD ["node", "./dist/server.js"]