# Use an official Node.js runtime as the base image
FROM node:14.21.3

# Set the working directory in the container
WORKDIR /project/cityinfo/citysimulator

# Copy the package.json and package-lock.json files to the container
COPY ./package.json /project/cityinfo/citysimulator/
COPY ./package-lock.json* /project/cityinfo/citysimulator/

# Install the app's dependencies in the container
RUN npm install

# Copy the rest of the app's files to the container
COPY . .

# Build the app
RUN npm run build

# Specify the command to run when the container starts
CMD ["sh", "-c", "npm run dev & tail -f /dev/null"]