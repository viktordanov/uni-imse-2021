FROM node:alpine
RUN mkdir /server
WORKDIR /server
RUN apk add --no-cache libc6-compat
CMD ["yarn", "serve"]