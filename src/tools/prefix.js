const creds = require("./../credentials/config")

module.exports = {
    description: "Every prefix that should trigger the bot. Does not support user input... Yet ?",
    prefix: (channel, user, message, self) => [
        {
            prefix: "melon", 
            condition: `!${creds.DEVELOPMENT}`, 
            description: "Can only be used if development is set to false. Primarily allows you to work on dev bot while not triggering the production bot."
        },
        
        {
            prefix: "melondev", 
            condition: `${creds.DEVELOPMENT}`, 
            description: "Opposite of 'melon' prefix, only trigger the development bot."
        },

        {
            prefix: "foo", 
            condition: `${user['user-id']} === ${creds.OWNER_USER_ID}`, 
            description: "Only work if command caller is owner of the bot."
        },
        {
            prefix: "🍉",
            condition: `!${creds.DEVELOPMENT}`,
            description: "melon prefix but emote" 
        }
    ],
}