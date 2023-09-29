
##################
## SYSTEM LAYER ##
##################
FROM ubuntu
FROM node

# Create app directory

WORKDIR /usr/src/app

# Install app dependencies

COPY package*.json ./

RUN yarn install

# Bundle app source


COPY . .

RUN apt-get update && apt-get install
RUN apt install ffmpeg -y 

EXPOSE 4000

CMD [ "yarn", "start" ]
