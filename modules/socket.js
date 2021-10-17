// This does nothing for now. Until i create the software that will be listening on this socket port. Unix based system only. Uses unix socket.

var net = require('net');

// Our socket
const SOCKETFILE = '/tmp/NodeSocketMarkov.sock';

exports.UnixSocket = (method, message) => {
    const socket = net.createConnection(SOCKETFILE, () => {
        socket.on('connect', () => {
            console.log("Connected");
        })
        socket.on('error', (error) => {
            console.log(error.code, 'SOCKET ERROR')
            socket.destroy();
            throw error;
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
                        socket.on('data', (data) => {
                            console.log(data.toString());
                            socket.destroy();
                            return data.toString();
                        })
                    }, 2000);
                })
            })
            break;
        }
    }
}

