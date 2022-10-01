FROM node:lts-alpine AS build

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stage-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/proxy/default.conf /etc/nginx/conf.d

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]
