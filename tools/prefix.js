const creds = require("./../credentials/config")

module.exports = {
    description: "Every prefix that should trigger the bot. Does not support user input... Yet ?",
    prefix: [
        {prefix: "melon", condition: "true;"},
        {prefix: "melondev", condition: `${creds.DEVELOPMENT};`},
    ],
}