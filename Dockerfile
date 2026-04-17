# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the websocket server file
COPY websocket-server.js ./

# Expose the WebSocket port
EXPOSE 3001

# Start the WebSocket server
CMD ["node", "websocket-server.js"]
