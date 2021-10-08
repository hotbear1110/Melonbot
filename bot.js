require('dotenv').config()
const tmi = require('tmi.js');
const login = require('./credentials/login.js').options;
const requireDir = require("require-dir");
const fs = require('fs');
const tools = require("./tools/tools")
const creds = require("./credentials/config")
const prefix = require("./tools/prefix").prefix

const client = new tmi.client(login)
client.connect();

(async () => {

    async function messageHandler(channel, user, message, self) {
        if (self) { return; }
        let input = message.split(" ");
        
        let command = input[1];

        for (var i = 0; i < prefix.length; i++) {
            if (input[0] !== prefix[i].prefix && prefix[i].allowed !== true) {
                break;
            }
        }
        
        if (input.length <= 1) { return; }

        const commands = requireDir("./commands");
        
        if(typeof commands[command] === "undefined") {
            client.say(channel, `${user.username} undefined command FeelsDankMan`);
            return;
        }
        
        //[TODO]: Get perm done
        const perm = 101;
        if (perm < 100) {
            return;
        }
        
        let realchannel = channel.substring(1);
        let realinput = input.slice(2);
        let result = await commands[command].execute(realchannel, user, realinput, perm);
        
        if(!result || result === "") {
            return;
        }
        
        if(commands[command].ping === true){
            result = `@${user['display-name']}, ${result}`;
        }
        
        //[TODO]: Banphrase
        
        client.say(channel, result);

        // Increment the command to stats.
        tools.query("UPDATE stats SET commandsHandled = commandsHandled + 1 WHERE where_placeholder = 1;")
    }

    client.on('message', async (channel, user, message, self) => {
        await messageHandler(channel, user, message, self);
    });
    
    client.on('connected', (addr, port) => {
        console.log(`* Connected to ${addr}:${port}`);
    });

})();

module.exports = { client };