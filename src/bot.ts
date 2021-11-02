import { ChatUserstate } from "tmi.js";
import tmi from 'tmi.js';
import { options as login } from './credentials/login.js';
import requireDir from "require-dir";
import * as tools from "./tools/tools"
import * as creds from "./credentials/config";
import Prefix from "./tools/prefix"
import _ from "underscore";
import vm from "vm";
// import { UnixSocket } from "./modules/socket";
// import process from 'process';

const client: tmi.Client = new tmi.client(login)
client.connect();


async function run(): Promise<void> {

    let forsen = false;
    
    async function messageHandler(channel: string, user: ChatUserstate, message: string, self: boolean) {
        try {
        // Don't listen to your own messages.
        if (self) { return; }
        
        // Sometimes self doesn't work.
        if (user["username"] === creds.USERNAME) { return; }
        
        if (channel === "#forsen") { channel === `#${creds.USERNAME}` }
        
        const input: Array<string> = message.split(" ");

        // If someone says forsen [Does not trigger on forsenE, forsenY etc] add to channel stats.
        // If NymN's viewers says Nime + forsen or just forsen, send Nime ❗ 
        if ((new RegExp(`\\bforsen\\b`).test(message.toLowerCase()))) {
            tools.updateStats(channel.substring(1), 'forsen');
            if ((channel === "#nymn") && ((message.includes("Nime") || message.includes("nymnIme")) || message === "forsen")) {
                let m = "Nime ❗"; 
                if (forsen) {
                    m += " 󠀀 "
                }
                client.say(channel, m);
                forsen = !forsen
            }
        }

        if ((input[1] === "nymnLick") && (channel === "#nymn") && user['username'] === "tepidp") {

            const isLive: boolean = await tools.Live(channel);

            if (isLive) {
                return;
            }
            
            if (input[0] === "melon") {
                client.say(channel, "@TepidP, nymnLick");
            } else {
                client.say(channel, `@${input[0]} nymnLick`)
            }
        }


        // If message only has the prefix for example
        if (input.length <= 1) { return; }
        
        const command: string = input[1];

        // Chatterino adds two characters to let the user spam.
        // We remove them because typescript and "use strict" stops this from working.
        // Is my hypothesis specifically u-56128 u-56320

        for (let i = 0; i < command.length; i++) {
            console.log(command.charCodeAt(i));
        }
        
        command.replace(/s+/g, ' ').trim();
        command.replace(/[\u56128]/, "");
        command.replace(/[\u56320]/, "");


        
        const p = new Prefix(channel, user, message, self).GetPrefix();
        // No real reason for this. primarily just for fun. Checks the input against every prefix in [./tools/prefix.js] and does a conditional.
        const hasPrefix = p.map((prefix) => {
            switch (input[0]) {
            case prefix.prefix:
                return vm.runInNewContext(prefix.condition);
            }
        })

        // If the message does not include a prefix we add it to the markov bot and then return.
        if (!hasPrefix.includes(true)) { 
            (async () =>  {
                // Send the input to the Markov Program. 
                // This is disabled in windows as to my knowledge, windows does not have the socket i want. but i could be wrong.
                // if (process.platform !== "win32" && creds.DEVELOPMENT === true) { // Make sure production bot can't run it for now.
                //     // Connect and write if it connected.
                //     UnixSocket("WRITE", message);
                // }
            }) 
            return;
        }
        const commands = requireDir("./commands");
        


        console.log(command)
        console.log(commands[command])
        // Was the message a command
        if(typeof commands[command] === "undefined") {
            client.say(channel, `${user["username"]} undefined command FeelsDankMan`);
            return;
        }

        
        
        // If the command specifies it only works while offline then check if streamer is live.
        if (commands[command].onlyOffline === true) {
            if (await tools.Live(channel) === true) { 
                return; 
            }
        }
        
        // [TODO]: Get perm done
        const perm = 101;
        if (perm < 100) {
            return;
        }
        
        const realchannel = channel.substring(1);
        const realinput = input.slice(2);
        // Run the command
        let result = await commands[command].execute(realchannel, user, realinput, perm);
        
        // Increment the command to stats.
        tools.query("UPDATE stats SET commandsHandled = commandsHandled + 1 WHERE where_placeholder = 1;")
        // Update channel stats
        tools.query("UPDATE channel_stats SET CommandsHandled = CommandsHandled + 1 WHERE Channel = ?;", [realchannel])

        // Don't say anything if no message came back
        if(!result || result === "") {
            return;
        }

        // Add a @username if command wants to ping
        if(commands[command].ping === true){
            result = `@${user['display-name']}, ${result}`;
        }
        
        const banPhrase = await tools.banPhrase(channel, result).catch((error) => {
            console.log(error);
            tools.logger(error, "error");
        });
        if(banPhrase) {
            client.say(channel, "cmonBruh Banphrase detected.")
        } else {
            // Respond in the chat
            client.say(channel, result);
        }
    } catch (error) {
        console.log(error)
        tools.logger(JSON.stringify(error), "error")
    }
    }

    client.on('message', async (channel: string, user: ChatUserstate, message: string, self: boolean) => {
        await messageHandler(channel, user, message, self);
    });
    
    client.on('connected', async function (addr: string, port: number) {
        console.log(`* Connected to ${addr}:${port}`);

        const commands = requireDir("./commands");
        const dbCommands = await tools.query("SELECT * FROM commands")

        // Add or Update commands to the database.
        _.each(commands, async function(command) {
            let isCommand = 0;
            _.each(dbCommands, async function (dbcommand) {
                if (dbcommand.name === command.name) {
                    if (dbcommand.description !== command.description || dbcommand.perm !== command.perm) {
                        tools.query("UPDATE commands \
                                    SET description=?, \
                                    perm=? \
                                    WHERE name=?;", 
                                    [command.description, command.perm, command.name])
                    }
                    isCommand = 1;
                    return;
                }
            })
            if (isCommand === 0) {
                await tools.query("INSERT INTO commands \
                                    (name, description, perm) \
                                    VALUES (?, ?, ?)", 
                                    [command.name, command.description, command.perm])
            } 
        })
    });
}

export { client, run };