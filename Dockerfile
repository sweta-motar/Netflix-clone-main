#BUILD STAGE
FROM node:16.17.0-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# TMDB API
ARG TMDB_V3_API_KEY
ENV VITE_APP_TMDB_V3_API_KEY=${TMDB_V3_API_KEY}
ENV VITE_APP_API_ENDPOINT_URL="https://api.themoviedb.org/3"

#YOUR BACKEND API (VERY IMPORTANT)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build


# PRODUCTION STAGE
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=builder /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]