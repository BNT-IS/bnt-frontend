FROM node:12 AS buildEnv
COPY public public
COPY src src
COPY package.json package.json
RUN npm install 
RUN npm run build

FROM nginx:latest
COPY --from=buildEnv build /usr/share/nginx/html
EXPOSE 80
CMD nginx -g 'daemon off;'