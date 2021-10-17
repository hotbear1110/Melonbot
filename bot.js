require('dotenv').config()
const tmi = require('tmi.js');
const login = require('./credentials/login.js').options;
const requireDir = require("require-dir");
const tools = require("./tools/tools")
const creds = require("./credentials/config")
const prefix = require("./tools/prefix")
const _ = require("underscore")
const vm = require("vm")
const UnixServer = require("./modules/socket")
const process = require('process')

const client = new tmi.client(login)
client.connect();

// Create socket object if unix based system.
(async () => {

    async function messageHandler(channel, user, message, self) {
    try {
        // Don't listen to your own messages.
        if (self) { return; }
        
        // Sometimes self doesn't work.
        if (user["username"] === creds.USERNAME) { return; }
        
        let input = message.split(" ");

        // If someone says forsen [Does not trigger on forsenE, forsenY etc] add to channel stats.
        // If NymN's viewers says Nime + forsen or just forsen, send Nime ❗ 
        if ((new RegExp(`\\bforsen\\b`).test(message.toLowerCase()))) {
            tools.query("UPDATE channel_stats SET forsen = forsen + 1 WHERE Channel = ?;", [channel.substring(1)]);
            if ((channel === "#nymn") && (message.includes("Nime") || message === "forsen")) {
                client.say(channel, "Nime ❗ ");
            }
        }

        // If message only has the prefix for example
        if (input.length <= 1) { return; }
        
        let command = input[1];
        
        // No real reason for this. primarily just for fun. Checks the input against every prefix in [./tools/prefix.js] and does a condtitional
        const hasPrefix = prefix.prefix(channel, user, message, self).map((prefix) => {
            let allowed = false;
            switch (input[0]) {
            case prefix.prefix:
                allowed = vm.runInNewContext(prefix.condition);
            }
            return allowed
        })

        // If the message does not include a prefix we add it to the markov bot and then return.
        if (!hasPrefix.includes(true)) { 
            (async () =>  {
                // Send the input to the Markov Program. 
                // This is disabled in windows as to my knowledge, windows does not have the socket i want. but i could be wrong.
                if (process.platform !== "win32" && creds.DEVELOPMENT === true) { // Make sure production bot can't run it for now.
                    // Connect and write if it connected.
                    const socket = new UnixServer();
                    socket.connect()
                    socket.write(message);
                }
            }) 
            return;
        }

        // Commands
        const commands = requireDir("./commands");
        
        // Was the message a command
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
        
        const banPhrase = await tools.banPhrase(channel, message);
        if(banPhrase) {
            client.say(channel, "cmonBruh Banphrase detected.")
        } else {
            // Respond in the chat
            client.say(channel, result);
        }
    } catch (error) {
        console.log(error)
        tools.logger(error, "error")
    }
    }

    client.on('message', async (channel, user, message, self) => {
        await messageHandler(channel, user, message, self);
    });
    
    client.on('connected', async function (addr, port) {
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
    
})();

module.exports = { client };