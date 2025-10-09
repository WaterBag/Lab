FROM node:18-alpine
RUN npm install pnpm -g
COPY ./ /app
WORKDIR /app
RUN pnpm install && pnpm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
