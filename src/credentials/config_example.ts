import path from 'path';

export const OAUTH = "oauth:code" // Twitch oauth code
export const MYSQL_USER = ""; // Mysql database username, leave blank for no username
export const MYSQL_PASSWORD = ""; // Mysql database password, leave blank for no pass
export const MYSQL_DATABASE = ""; // Name of database
export const MYSQL_HOST = ""; // Address to host
export const TWITCH_CLIENT_ID = "" // Twitch client id 4Head
export const TWITCH_CLIENT_SECRET = "" // Twitch client secret 4Head
export const USERNAME = "" // Bots username
export const OWNER_USER_ID = 146910710 // Owners user id, curl example further down V
export const DEVELOPMENT = false; // Default false, dont worry about this.
export const ROOT = path.resolve(__dirname) // Root of the program
export const SERVER = "http://localhost:3000" // URL of the website [ https://github.com/JoachimFlottorp/web.flottorp.org ] 


/* 
///////////// OWNER USER ID EXAMPLE CURL /////////////

OWNER_USER_ID can easily be gotten by going to the web server and logging in as the owner. 

curl https://api.twitch.tv/helix/users -H "Authorization: Bearer TWITCH_AUTH_TOKEN"  -H "Client-Id: TWITCH_CLIENT_ID"

*/
