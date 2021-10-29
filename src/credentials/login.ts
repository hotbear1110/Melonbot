import * as creds from './config.js';
import mysql from 'mysql';
import * as tools from './../tools/tools.js'
export const con: mysql.Connection = mysql.createConnection({
    host: creds.MYSQL_HOST,
    user: creds.MYSQL_USER,
    password: creds.MYSQL_PASSWORD,
    database: creds.MYSQL_DATABASE
});

con.on('error', (err) => {
    if (err.fatal) {
        con.destroy();
    }
    throw err;
});

// Async function, keep pinging the sql server to keep it alive.
export const pingDatabase = async () => {
    setInterval(function() {
        tools.query("SELECT 1");
    }, 60000)
}

const getChannels = async (): Promise<any> => {
    return new Promise((Resolve, Reject) => {
        con.query('SELECT * FROM channels', (err: mysql.MysqlError | null, results) => {
            if (err) {
                Reject(err);
            } else {
                Resolve(results);
            }
        });
    })
};

const channelOptions: string[] = []
async function res() {
    const channelList: Array<any> = []
	channelList.push(await getChannels().catch((error) => {
        throw error;
    }));
	return await channelList[0].forEach(
        (i: { channel_name: string; }) => {
            channelOptions.push(i.channel_name)
            tools.query("INSERT IGNORE INTO channel_stats (Channel) VALUES (?)", [i.channel_name])
        } 
    )
}
res()

export const options = {
    options: {
        debug: true,
        joinInterval: 300,
    },

    identity: {
        username: creds.USERNAME,
        password: creds.OAUTH
    },
    connection: {
        port: 80
    },
    channels: channelOptions,
}