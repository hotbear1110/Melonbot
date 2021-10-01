require('dotenv').config()
const axios = require("axios");

module.exports = {
    name: "get_channel_info",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            const res = await axios.get(`https://api.twitch.tv/helix/channels?broadcaster_id=${user['room-id']}`, {
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Authorization': `Bearer ${process.env.access_token}`,
                    'Client-ID': `${process.env.client_id}`
                } 
            });
            if(res.status >= 400) {
                return "There has been an error."
            }
            console.log(res.data.data)
            // console.log(typeof res.data.data)
            var data = JSON.stringify(res.data.data);
            data = data.replace("[{", "").split(',')

            return data;
            // return data[2].replace(`"broadcaster_name":"`, "").replace('"', '');
            // return '@'+ "a" + " :tf:";
        } catch (err) {
            console.log(err);
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}