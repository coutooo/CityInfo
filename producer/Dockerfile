# Use an official Node.js runtime as the base image
FROM node:14.21.3

# Set the working directory in the container
WORKDIR /project/cityinfo/producer

# Copy the package.json and package-lock.json files to the container
#COPY ["package.json", "package-lock.json*", "./"]
COPY ./package.json /project/cityinfo/producer/
COPY ./package-lock.json* /project/cityinfo/producer/

# Install the app's dependencies in the container
RUN npm install

# Copy the rest of the app's files to the container
COPY . .


#RUN npm run producer

# Specify the command to run when the container starts
#CMD ["npm", "run", "dev"]
CMD ["node","producer.js"]

# Expose the port that the app is listening on
EXPOSE 5000