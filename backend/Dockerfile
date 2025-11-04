# Use Node.js 20
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose frontend dev port (default 5173 for Vite)
EXPOSE 5173

# Start frontend dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
