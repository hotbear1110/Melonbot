import * as tools from "./../tools/tools"
import _ from 'underscore';
import axios from 'axios'
import * as creds from "./../credentials/config"

// Every 20 seconds check if a streamer is live.
setInterval(async () => {
    try {
        const channels = await tools.query("SELECT * FROM channels")

        _.each(channels, async (stream) => {
            // Every .5 seconds check if the streamer is live.
            setTimeout(async () => {

                await axios.get(`https://api.twitch.tv/helix/streams?user_login=${stream.channel_name}`, {
                    headers: {
                        'client-id': creds.TWITCH_CLIENT_ID,
                        'Authorization': `Bearer ${creds.OAUTH.split(":")[1]}`
                    }
                }).then(response => response.data.data)
                .then(async (response) => {
                    // User is live.
                    if (response.length !== 0 && stream.live === 0) {
                        tools.query("UPDATE channels SET live = 1 WHERE channel_name = ?", [stream.channel_name]);
                    }

                    // Streamer is not live.
                    if (response.length === 0 && stream.live === 1) {
                        tools.query("UPDATE channels SET live = 0 WHERE channel_name = ?", [stream.channel_name]);
                    }
                }).catch((error) => {
                    console.log(error)
                    return;
                })
                
            }, 500);
        })
    } catch (error) {
        console.log(error)
        tools.logger(JSON.stringify(error), "error")
    }
}, 20000);