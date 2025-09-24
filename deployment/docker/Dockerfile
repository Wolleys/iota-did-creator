FROM node:22-alpine

WORKDIR /app

# Copy all files needed for installation
COPY package*.json tsconfig.json ./

# Install without running scripts
RUN npm install --include=dev --ignore-scripts --legacy-peer-deps

# Copy source code
COPY src/ ./src/

# Now build
RUN npm run build

# Setup non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node dist/utils/HealthCheck.js || exit 1

CMD ["node", "dist/demo.js"]