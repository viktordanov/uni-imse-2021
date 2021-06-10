FROM mhart/alpine-node:slim 
RUN mkdir /server
WORKDIR /server
RUN apk add --no-cache libc6-compat
CMD ./node_modules/.bin/tsc -p . && node out/main.js