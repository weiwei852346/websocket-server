# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install --build-from-source

# Copy the websocket server file
COPY websocket-server.js ./

# Expose the WebSocket port
EXPOSE 3001

# Start the WebSocket server
CMD ["node", "websocket-server.js"]
