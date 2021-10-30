/* eslint-disable @typescript-eslint/no-unused-vars */
import shell from 'child_process';
import * as tools from './../tools/tools';
import * as creds from './../credentials/config';
import process from 'process';
import { ChatUserstate } from 'tmi.js';

export = {
    name: "ping",
    ping: true,
    description: "Pings the user with some small info.",
    perm: 100,
    onlyOffline: false,
    execute: async (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        try {
            const commitCount = shell.execSync("git rev-list --all --count");
            const commitSha = shell.execSync("git rev-parse --short HEAD");
            const branch = shell.execSync("git rev-parse --abbrev-ref HEAD");

            const devBot = creds.DEVELOPMENT ? " Development Bot" : " ";
            
            return `pong FeelsOkayMan . Running for ${tools.humanizeDuration(process.uptime())}. master, ${commitSha}, commit ${commitCount}, Branch: ${branch}.${devBot}`;
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}