FROM node:18.16.1-buster-slim

WORKDIR /app

COPY . .

RUN npm install -g node-gyp

RUN apt-get update
#RUN apk add --no-cache build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev libc-dev
RUN apt-get install -y build-essential g++ libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev libc6-dev

#RUN apt install python3 make g++ && rm -rf /var/cache/apk/*
RUN apt-get install -y python3 python3-dev make g++ && apt clean

RUN npm install @tensorflow/tfjs-node

RUN npm install 

CMD ["npm", "run", "build"]