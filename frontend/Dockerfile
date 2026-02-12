# Use the official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY frontend/ .

# Build the Next.js application
RUN npm run build

# Expose port 3000 to allow communication to/from the frontend
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]