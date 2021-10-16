// This does nothing for now. Until i create the software that will be listening on this socket port. Unix based system only. Uses unix socket.

var net = require('net');

// Our socket
const SOCKETFILE = '/tmp/NodeSocketMarkov.sock';

class UnixSocket {
    connect() {
        this.socket = net.createConnection(SOCKETFILE, () => {
            this.socket.on('connect', () => {
                console.log("Connected");
            })
            this.socket.on('error', (error) => {
                console.log(error.code, 'SOCKET ERROR')
                this.socket.destroy();
                throw error;
            })
        })
    }
    
    async write(message) {
        // Tell server we want to write, then send the message and close connection.
        this.socket.write("WRITE", () => {
            this.socket.write(message, () => {
                this.socket.destroy()
            })
        })
    }

    // Does nothing now.
    // eslint-disable-next-line no-unused-vars
    async read(message) {
        return "DEPRECATED"
    }
}    
    

module.exports = UnixSocket