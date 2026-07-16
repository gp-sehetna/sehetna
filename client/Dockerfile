FROM node:lts-alpine
WORKDIR /client-app

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

RUN pnpm install
COPY . .


# Build the application
RUN pnpm build
ENTRYPOINT ["pnpm", "start"]
CMD ["--port", "5000", "--hostname", "0.0.0.0"]
