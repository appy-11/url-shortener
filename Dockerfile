# -----------------------------
# Build stage
# -----------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files first so Docker can cache npm install.
COPY package*.json ./

RUN npm ci

# Copy frontend source/configuration.
COPY . .

# Vite environment variables are embedded during the build.
# The default is suitable for our local Docker setup.
ARG VITE_API_BASE_URL=http://localhost:3000
ARG VITE_SHORT_URL_DOMAIN=short.ly

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SHORT_URL_DOMAIN=$VITE_SHORT_URL_DOMAIN

# Build the React application.
RUN npm run build:client


# -----------------------------
# Production stage
# -----------------------------
FROM nginx:alpine AS production

# Remove Nginx's default static files.
RUN rm -rf /usr/share/nginx/html/*

# Copy our custom Nginx configuration.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Vite production build.
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx listens on port 80 inside the container.
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]