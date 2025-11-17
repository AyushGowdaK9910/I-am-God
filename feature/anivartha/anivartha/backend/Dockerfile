FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Create directories
RUN mkdir -p uploads temp

EXPOSE 3000

CMD ["npm", "start"]

