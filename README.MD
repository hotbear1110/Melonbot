# Twitch bot using NODE.JS

As always, don't use it. It sucks.

## Setup

1. Create a MYSQl server. And a database thingy inside it.
3. npm install
4. npm run build
5. Copy from [config_example.js](credentials/config_example.js) over to a [config.js](credentials/config.js) file with your credentials.
6. Run once: npm run start. Once it is. stop the process.
7. Access your mysql database in whichever way you prefer and add to the channels table the users which are using the bot. INSERT INTO channels (melon095), (twitch), (forsen);
8. npm run start
