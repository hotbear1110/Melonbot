exports.OAUTH = "oauth:code" // Twitch oauth code
exports.MYSQL_USER = ""; // Mysql database username, leave blank for no username
exports.MYSQL_PASSWORD = ""; // Mysql database password, leave blank for no pass
exports.MYSQL_DATABASE = ""; // Name of database
exports.MYSQL_HOST = ""; // Address to host
exports.TWITCH_CLIENT_ID = "" // Twitch client id 4Head
exports.TWITCH_CLIENT_SECRET = "" // Twitch client secret 4Head
exports.USERNAME = "" // Bots username
exports.OWNER_USER_ID = 146910710 // Owners user id, curl example further down V
exports.DEVELOPMENT = false; // Default false, dont worry about this.



/* 
///////////// OWNER USER ID EXAMPLE CURL /////////////

OWNER_USER_ID can easily be gotten by going to the web server and logging in as the owner. 

curl https://api.twitch.tv/helix/users -H "Authorization: Bearer TWITCH_AUTH_TOKEN"  -H "Client-Id: TWITCH_CLIENT_ID"

*/
