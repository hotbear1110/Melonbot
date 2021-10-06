const got = require('got')
const tools = require("./../tools/tools")
const creds = require('./../credentials/config')
const axios = require("axios")

module.exports = {
    name: "settitle",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            if(!tools.isMod(user, channel)) {
                throw "Mod Only Command."
            }

            title = input.splice(0)
                .toString().replaceAll(',', ' ');
                
            if (title === "") {
                throw "Sorry, i am unable to set the title to nothing."
            }

            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await tools.token(user['room-id'])}`,
                    'Client-ID': `${creds.TWITCH_CLIENT_ID}`,
                }
            }

            const body = { "title": title };
            
            await axios.patch(`https://api.twitch.tv/helix/channels?broadcaster_id=${user['room-id']}`, body, options)
            .catch((error) => {
                console.log(error)
                throw error;
            })
            return "Successfully changed title to " + title;
        } catch (err) {
            return err
        }
    }
} 