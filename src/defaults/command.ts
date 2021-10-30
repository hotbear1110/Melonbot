// Default Command File

/* eslint-disable @typescript-eslint/no-unused-vars */
import * as tools from './../tools/tools';
import * as creds from './../credentials/config';
import { ChatUserstate } from 'tmi.js';

export = {
    name: "NAME",
    ping: true,
    description: "DESCRIPTION",
    perm: 100,
    onlyOffline: false,
    execute: async  (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        try {
            return "THIS"
        } catch (err) {
            console.log(err)
            tools.logger(JSON.stringify(err), "error")
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan. ${err}`
        }
    }
}
