# Use Node.js 20 as base
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Expose backend port (change if your server uses a different port)
EXPOSE 5000

# Start backend
CMD ["node", "index.js"]

