FROM node:alpine
RUN mkdir /server
WORKDIR /server
RUN apk add --no-cache libc6-compat
COPY . /server
RUN yarn install 
CMD ["yarn", "serve"]