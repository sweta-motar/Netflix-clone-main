# BUILD STAGE
FROM node:18-alpine AS builder

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install

# 🔥 use build arguments instead of .env
ARG TMDB_V3_API_KEY
ARG VITE_API_URL

# set environment variables for Vite
ENV VITE_APP_TMDB_V3_API_KEY=$TMDB_V3_API_KEY
ENV VITE_API_URL=$VITE_API_URL

# copy project files
COPY . .

# build project
RUN npm run build


# PRODUCTION STAGE
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# copy build output
COPY --from=builder /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
