// const tools = require("../tools/tools")
// const UnixSocket = require("./../modules/socket").UnixSocket;
import * as tools from './../tools/tools';
import { ChatUserstate } from 'tmi.js';

exports = {
    name: "markov",
    ping: false,
    description: "Returns a sentence parsed from a markov bot on the channel.",
    perm: 100,
    onlyOffline: true,
    execute: async (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        try {
            return "THIS"
            // return UnixSocket("READ", input.join(" "));
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan ${err}`
        }
    }
}