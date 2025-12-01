# Use the official Node.js image as the base image
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the frontend app runs on
EXPOSE 5173

# Define the command to run the frontend application
CMD ["npm", "run", "dev"]