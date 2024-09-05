# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /src

# Copy Prisma configuration and package files
COPY prisma ./prisma/
COPY package*.json ./

# Copy the Firebase admin SDK JSON key
COPY src/utils/aiprs-ba699-firebase-adminsdk-7akpp-7285ecac38.json ./src/utils/

# Install production dependencies
RUN npm ci --only=production

# Install build tools and TypeScript globally
RUN npm install -g typescript

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Run Prisma generate (if using Prisma ORM)
RUN npx prisma generate

# Stage 2: Final Stage
FROM node:18-alpine AS production

# Set working directory inside the container
WORKDIR /src

# Copy only the necessary files from the build stage
COPY --from=builder /src/package*.json ./
COPY --from=builder /src/dist ./dist
COPY --from=builder /src/prisma ./prisma
COPY --from=builder /src/src/utils/aiprs-ba699-firebase-adminsdk-7akpp-7285ecac38.json ./src/utils/

# Install only production dependencies
RUN npm ci --only=production

# Expose the port your app runs on
EXPOSE 5000

# Define environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]


# FROM node:18-alpine AS base
# WORKDIR /app
# FROM base AS install
# RUN mkdir -p /temp/prod
# COPY package.json package-lock.json bun.lockb prisma /temp/prod/
# RUN cd /temp/prod && npm install
# RUN cd /temp/prod && npx prisma generate
# FROM base AS prerelease
# COPY --from=install /temp/prod/node_modules /app/node_modules
# COPY . .
# ENV NODE_ENV=production
# FROM base AS release
# COPY --from=prerelease /app/node_modules /app/node_modules
# COPY --from=prerelease /app/src /app/src
# COPY --from=prerelease /app/prisma /app/prisma
# COPY --from=prerelease /app/package.json /app/package.json
# COPY --from=prerelease /app/tsconfig.json /app/tsconfig.json
# COPY --from=prerelease /app/.env.docker /app/.env
# EXPOSE 5000
# RUN npm run build
# CMD ["npm", "start"]
