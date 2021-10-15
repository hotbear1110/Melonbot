// This does nothing for now. Until i create the software that will be listening on this socket port. Unix based system only. Uses unix socket.

var net = require('net');

// Our socket
const SOCKETFILE = '/tmp/NodeSocketMarkov.sock';

class UnixSocket {
    connect() {
        this.socket = net.createConnection(SOCKETFILE)
            .on('connect', () => {
                console.log("Connected");
            })
            .on('error', (error) => {
                console.log(error.code, 'SOCKET ERROR')
                return false
            })
        return true;
    }
    
    async write(message) {
        // Tell server we want to write, then send the message and close connection.
        this.socket.write("WRITE", () => {
            this.socket.write(message, () => {
                this.socket.destroy()
            })
        })
    }
}    
    

module.exports = UnixSocket