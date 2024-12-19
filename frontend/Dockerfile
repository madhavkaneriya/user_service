# Dockerfile for React app
FROM node:22.12-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./

RUN npm install

# Copy the entire frontend code into the container
COPY frontend/ ./

# Build the application
RUN npm run build

# Install a lightweight server to serve the React app
FROM nginx:stable-alpine

# Copy the build files to Nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port that Nginx will use
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]