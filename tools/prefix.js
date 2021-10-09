const creds = require("./../credentials/config")

module.exports = {
    description: "Every prefix that should trigger the bot. Does not support user input... Yet ?",
    prefix: (channel, user, message, self) => [
        {prefix: "melon", condition: "true;"},
        {prefix: "melondev", condition: `${creds.DEVELOPMENT};`},
        {prefix: "foo", condition: `${user['user-id']} === ${creds.OWNER_USER_ID}`}
    ],
}