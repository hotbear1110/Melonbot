const con = require('./../credentials/login.js').con
const mysql = require("mysql");
const tools = require("./tools.js");
const fs = require('fs');
const readline = require('readline')


exports.initDatabase = (website) => {
    var rl = readline.createInterface({
        input: fs.createReadStream(website ? './../init.sql' : './init.sql'),
        terminal: false,
    });
    rl.on('line', async function(chunk) {
        const a = await tools.query(chunk)
    })
}

exports.query = (query, data = []) => new Promise((Resolve, Reject) => {
    con.query(mysql.format(query, data), async (err, results) => {
        if (err) {
            console.log(query, '\n//\n', err);
            await tools.query(`
                INSERT INTO error_logs (error_message) VALUES (?)`,
                [JSON.stringify(err)])
            Reject(err);
        } else {
            Resolve(results)
        }
    });
})

exports.convertHMS = (timeInSeconds) => {
    try {
        const sec = parseInt(timeInSeconds, 10); // convert value to number if it's string
        let hours   = Math.floor(sec / 3600); // get hours
        let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
        // add 0 if value < 10; Example: 2 => 02
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
    } catch (err) {
        console.error(err)
    }
}

exports.YMD = () => {
    let date = new Date();
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.log` 
}

exports.YMDHMS = () => {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}` 
}
