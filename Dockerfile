FROM alpine:latest

WORKDIR /app

COPY . .

# Install NodeJS and NPM
RUN apk add --update npm

# MYSQL
EXPOSE 3306 
# WEBSITE
EXPOSE 443
# TWITCH BOT
EXPOSE 80

RUN npm start

CMD ["npm", "install"]
