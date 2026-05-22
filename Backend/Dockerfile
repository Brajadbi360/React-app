# Production Node.js image — credentials come from K8s Secret env vars, not .env
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
# .dockerignore keeps .env out of the image
EXPOSE 5000
CMD ["node", "server.js"]
