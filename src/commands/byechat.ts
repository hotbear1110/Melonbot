import * as tools from './../tools/tools';
import * as creds from './../credentials/config';
import { ChatUserstate } from 'tmi.js';

export = {
    name: "byechat",
    ping: false,
    description: "Simply outputs the 'Okayge BYE CHAT' copypasta",
    perm: 100,
    onlyOffline: false,
    execute: async (channel: string, user: ChatUserstate, input: string[], self: boolean) => {
        try {
            return "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀ ⠀⠀ ⠀ ⠀⠀ ⠀ ⠀⠀⎝ Okayge BYE CHAT⠀⠀ ⠀⠀⠀ ⠀⠀ ⠀ ⠀⠀ ⠀⠀ ⠀ ⠀⠀⠀⠀⠀ ⠀ ⠀┬─┬ 󠀀 ";
        } catch (err) {
            return `Madge , bad command, you almost killed me! Notifying owner FeelsWeirdMan`
        }
    }
}