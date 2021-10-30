import got from 'got';
import * as tools from "./../tools/tools";
import * as creds from './../credentials/config';
import axios from "axios";
import { ChatUserstate } from 'tmi.js';

export = {
    name: "settitle",
    ping: true,
    description: `Sets the title of a channel. Requires the broadcaster to login at the bots website: ${creds.SERVER}. Only mods and broadcaster may run this command.`,
    perm: 100,
    onlyOffline: false,
    execute: async (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        try {
            if(!tools.isMod(user, channel)) {
                throw "Mod Only Command."
            }

            const title = input.splice(0)
                .toString().replace(/,/g, ' ');
                
            if (title === "") {
                throw "Sorry, i am unable to set the title to nothing."
            }

            const token = await tools.token(Number(user['room-id']))

            if (token.status === "ERROR") {
                throw token.error
            }

            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.token}`,
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