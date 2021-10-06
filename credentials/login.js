const creds = require('./config.js');
const mysql = require('mysql');
const tools = require('./../tools/tools.js')
const con = mysql.createConnection({
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
const pingDatabase = async => {
    setInterval(function() {
        tools.query("SELECT 1");
    }, 60000)
}

const getChannels = () => new Promise((resolve, reject) => {
    con.query('SELECT * FROM channels', (err, results) => {
        if (err) {
            reject(err);
        } else {
            resolve(results);
        }
    });
});

const channelOptions = []
async function res() {
    const channelList = []
	channelList.push(await getChannels());
	return await channelList[0].forEach(i => channelOptions.push(i.channel_name))
}
res()

const options = {
    options: {
        debug: true,
        joinInterval: 300,
    },

    identity: {
        username: creds.USERNAME,
        password: creds.OAUTH
    },
    connection: {
        port: 6697
    },
    channels: channelOptions,
}

module.exports = { options, con, pingDatabase }