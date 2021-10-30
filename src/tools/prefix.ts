/* eslint-disable @typescript-eslint/no-unused-vars */
import * as creds from "./../credentials/config"
import { ChatUserstate } from "tmi.js";

type PrefixArray = {
    prefix: string,
    condition: string,
    description: string
}

export default class Prefix {
    description: string;
    prefix: PrefixArray[];
    constructor(channel: string, user: ChatUserstate, message: string, self: boolean) {
        this.description = "Every prefix that should trigger the bot. Does not support user input... Yet ?"
        
        this.prefix = [
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
        ];
    }

    GetPrefix() {
        return this.prefix;
    }
}