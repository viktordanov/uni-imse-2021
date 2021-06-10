FROM node:alpine
RUN mkdir /server
WORKDIR /server
RUN apk add --no-cache libc6-compat
RUN yarn install 
CMD ["yarn", "serve"]