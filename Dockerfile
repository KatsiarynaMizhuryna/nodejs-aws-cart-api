FROM node:20-alpine AS build
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci --production && npm install rimraf --save-dev && npm cache clean --force
COPY --chown=node:node . .
USER node
RUN npm run build


# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force
USER node
ENV PORT=4000
EXPOSE 4000
CMD ["node", "dist/main.js"]
