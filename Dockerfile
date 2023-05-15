FROM node:18.16.0-alpine3.16

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node package*.json ./

RUN npm ci

COPY --chown=node ./ .

RUN npm run build
RUN npm run prisma:generate
# RUN npm run prisma:migrate

EXPOSE 2222

CMD ["npm", "run", "start:prod"]
