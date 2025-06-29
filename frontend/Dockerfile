# Stage 1: Build the React app
FROM node:22.14.0-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
# Leverage caching by installing dependencies first
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


# Copy the rest of the application code and build for production
COPY . ./
RUN pnpm build

# Stage 2: Development environment
FROM node:22.14.0-alpine AS development
WORKDIR /app

RUN corepack enable
# Install dependencies again for development
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the full source code
COPY . ./

# Expose port for the development server
EXPOSE 5173
CMD ["pnpm", "dev"]

# Stage 3: Production environment
FROM nginx:alpine AS production

# Copy the production build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default NGINX port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]