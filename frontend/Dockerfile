# stage 1 - dev
FROM node:18-bullseye-slim AS development

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ENV PREFIX_PATHS=false
ENV GATSBY_TELEMETRY_DISABLED 1
ENV GATSBY_API_URL https://6zv5yffnhzwa.bieda.it/api
ENV GATSBY_SITE_URL https://6zv5yffnhzwa.bieda.it

RUN env | while IFS= read -r line; do echo "$line" >> ".env.$NODE_ENV"; done

WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY . ./
EXPOSE 8000

CMD ["npm", "run", "dev"]