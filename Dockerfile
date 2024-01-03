# Base
FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force

# Build
WORKDIR /app
COPY . .
RUN npm run build

# Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=base /app/package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=base /app/dist ./dist

USER node
ENV PORT=4000
ENV RDS_HOST=cart-db.c9m62uuwu3yl.eu-west-1.rds.amazonaws.com
ENV RDS_PORT=5432
ENV RDS_DATABASE_NAME=postgres
ENV RDS_USERNAME=postgres
ENV RDS_PASSWORD=cjGGeQqo1LLBY7a0JGUa

EXPOSE 4000
CMD ["node", "dist/main.js"]
