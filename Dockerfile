FROM alpine:latest

WORKDIR /app

COPY ./package.json ./

# Install NodeJS and NPM
RUN apk add --update npm

RUN npm install

COPY . .

# MYSQL
EXPOSE 3306 
# WEBSITE
EXPOSE 443
# TWITCH BOT
EXPOSE 80

RUN npm install

RUN npm run build

CMD ["npm", "start"]
