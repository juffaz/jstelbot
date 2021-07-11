FROM node:12.18.1
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get install -y libnss3-dev chromium \
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .

CMD [ "node", "bot" ]
