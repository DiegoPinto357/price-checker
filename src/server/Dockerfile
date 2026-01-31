# Build stage
FROM node:20-alpine AS builder

WORKDIR /home/node/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code and build files
COPY . .

# Build the application using tsup
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /home/node/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /home/node/app/dist ./dist

# Copy PM2 ecosystem config
COPY ecosystem.config.cjs ./

# Create logs directory
RUN mkdir -p logs

# Expose the application port
EXPOSE 3002

# Use PM2 to run the application
CMD ["npx", "pm2-runtime", "start", "ecosystem.config.cjs"]
