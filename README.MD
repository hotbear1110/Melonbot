# Twitch bot using NODE.JS

As always, don't use it. It sucks.
This is just a fun small project as is not meant to used as a 'commercial' bot.

## Setup

1. Create a MYSQl server. And a database thingy inside it.
2. Copy from [config_example.js](credentials/config_example.js) over to a [config.js](credentials/config.js) file with your credentials.
3. cd down -> website -> flottorp | rename .env.example to .env and change the values inside.
4. npm install
5. npm run build
6. Run once: npm run start. Once it is. stop the process.
7. Access your mysql database in whichever way you prefer and add to the channels table the users which are using the bot. INSERT INTO channels (melon095), (twitch), (forsen);
8. npm run start
