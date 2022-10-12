FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --frozen-lockfile
COPY . .
RUN node ace build --production \
--ignore-ts-errors && cd build && npm ci --production --frozen-lockfile

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build .
EXPOSE 3333
CMD ["node", "server.js"]
