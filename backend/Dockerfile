# Official nodejs image as base image
FROM node:22.12-alpine
# Working directory inside the container
WORKDIR /usr/src/app

COPY backend/package*.json ./

RUN npm install

# Copy the entire backend code into the container
COPY backend/ ./

# Build the application
RUN npm run build

# port for this app to run on
EXPOSE 3000

# command to run the app
CMD ["npm", "run", "start:prod"]