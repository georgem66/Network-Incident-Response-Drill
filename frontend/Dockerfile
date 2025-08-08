FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S frontend -u 1001

# Change ownership
RUN chown -R frontend:nodejs /app
USER frontend

EXPOSE 3000

# Serve the built application
CMD ["npx", "serve", "-s", "build", "-l", "3000"]