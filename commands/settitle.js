require('dotenv').config()
const axios = require('axios');
const ms = require('ms');
const { client } = require("../bot");
const tools = require("./../tools/tools")

async function GetChannelAuthToken(id, commandCaller) {
    return new Promise((Resolve, Reject) => {
        try {
            // Ask database for the channels token

            const token = tools.validateToken(tools.query(`SELECT * FROM tokens WHERE user_id = ?`, [id]))
            console.log(token)

            Resolve(token)
        } catch (err) {
            Reject(err)
        }
    })
}

module.exports = {
    name: "settitle",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let isMod = user.mod || user['user-type'] === 'mod';
            let isBroadcaster = channel === user.username;
            let isModUp = isMod || isBroadcaster;
            if(!isModUp) {
                throw "Mod Only Command."
            }
            title = input.splice(0)
                .toString().replaceAll(',', ' ');
            if (title === "") {
                throw "Sorry, i am unable to set the title to nothing."
            }
            
            await GetChannelAuthToken(user['room-id'], channel)
            .then((token) => {
                const body = {"title": title};
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Client-ID': `${process.env.client_id}`,
                    }
                }
                // axios.patch(`https://api.twitch.tv/helix/channels?broadcaster_id=${user['room-id']}`, body, options)
                //     .catch(() => {
                //     throw "Error, Bot-Side"
                // }); 
            }).catch((err) => {
                console.log(err)
                throw err
            });
            return "Successfully changed title to " + title;
        } catch (err) {
            return err
        }
    }
} 