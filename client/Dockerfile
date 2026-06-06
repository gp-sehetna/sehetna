FROM node:lts-alpine
WORKDIR /client-app


RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml package.json ./


RUN pnpm install
COPY . .


ENTRYPOINT ["pnpm", "dev"]
CMD ["--hostname", "0.0.0.0", "--port", "5000"]
