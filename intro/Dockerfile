FROM node:22-alpine
RUN npm install pnpm@9.13.2 -g
COPY ./ /app
WORKDIR /app
RUN pnpm install
RUN pnpm run build

# EXPOSE 5000

CMD pnpm run start
