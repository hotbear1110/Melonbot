// This does nothing for now. Until i create the software that will be listening on this socket port. Unix based system only. Uses unix socket.

var net = require('net');

// Our socket
const SOCKETFILE = '/tmp/NodeSocketMarkov.sock';

exports.UnixSocket = (method, message) => {
    let data = "";
    const socket = net.createConnection(SOCKETFILE, () => {
        socket.on('connect', () => {
            console.log("Connected");
        })
        socket.on('error', (error) => {
            console.log(error.code, 'SOCKET ERROR')
            socket.destroy();
            throw error;
        })
        socket.on('data', (data) => {
            console.log(data.toString());
            data = data.toString();
            socket.destroy();
        })
    });

    switch (method) {
        case "WRITE": {
            socket.write("WRITE", () => {
                socket.write(message, () => {
                    socket.destroy()
                })
            })
            break;
        }

        case "READ": {
            socket.write("READ", () => {
                socket.write(message, () => {
                    setTimeout(() => {
                        return data.toString();
                    }, 2000);
                })
            })
            break;
        }
    }
}

