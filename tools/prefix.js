const creds = require("./../credentials/config")


module.exports = {
    description: "Every prefix that should trigger the bot.",
    prefix: [
        {prefix: "melon", allowed: true},
        {prefix: "melondev", allowed: creds.DEVELOPMENT}
    ]
}