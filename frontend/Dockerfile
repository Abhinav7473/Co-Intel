# syntax=docker/dockerfile:1.7
# node_modules only ever exist inside the image — nothing is installed on the host.

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN --mount=type=cache,target=/root/.npm npm install --no-audit --no-fund

# ---------------------------------------------------------------- dev (HMR)
FROM deps AS dev
COPY . .
EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]

# ---------------------------------------------------------------- build
FROM deps AS build
COPY . .
RUN npx tsc --noEmit && npx vite build

# ---------------------------------------------------------------- prod edge
FROM nginx:stable-alpine AS prod
COPY --from=nginx prod.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8088
