# BUILD STAGE
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# ✅ copy .env so Vite can read it
COPY .env .env

# copy project files
COPY . .

# ✅ build project (Vite reads env here)
RUN npm run build


# PRODUCTION STAGE
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]