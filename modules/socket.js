// This does nothing for now. Until i create the software that will be listening on this socket port. Unix based system only. Uses unix socket.

var net = require('net');

// Our socket
const SOCKETFILE = '/tmp/NodeSocketMarkov.sock';

const UnixSocket = net.createConnection(SOCKETFILE, () => {
    UnixSocket.on('connect', () => {
        console.log("Connected");
    })
    UnixSocket.on('error', (error) => {
        console.log(error.code, 'SOCKET ERROR')
        this.socket.destroy();
        throw error;
    })
});

function Write(message) {
    UnixSocket.write("WRITE", () => {
        UnixSocket.write(message, () => {
            UnixSocket.destroy()
        })
    })
}

function Read(message) {
    UnixSocket.write("READ", () => {
        UnixSocket.write(message, () => {
            setTimeout(() => {
                UnixSocket.on('data', (data) => {
                    console.log(data.toString());
                    UnixSocket.destroy();
                    return data.toString();
                })
            }, 2000);
        })
    })
}

module.exports = { UnixSocket, Write, Read };