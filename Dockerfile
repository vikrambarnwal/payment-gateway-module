# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src/config ./src/config
COPY --from=build /app/.env ./
# Add this line to copy the entire src directory for Swagger JSDoc
COPY --from=build /app/src ./src
EXPOSE 3000
CMD ["node", "dist/index.js"] 