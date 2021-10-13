// This does nothing for now. Until i create the software that will be listening on this socket port. Unix based system only. Uses unix socket.

var net = require('net');

// Our socket
const SOCKETFILE = '/tmp/EPSNodeSocketMarkov.sock';

class UnixSocket {
    constructor(port = 5863) {
        this.port = port
        this.isConnected = false
    }
    
    static connect() {
        this.client = net.createConnection(SOCKETFILE)
            .on('connect', () => {
                console.log("Connected");
            })
            .on('error', (error) => {
                console.log(error.code, 'SOCKET ERROR')
            })
        this.client.write("CONNECTED")
        this.isConnected = true
    }

    static async write(message) {
        if(this.isConnected) {
            this.client.write(message)
            await this.client.on('close')
        } else {
            console.timeStamp();
            console.log("Not connected to socket, unable to send message.")
        }
    }
}    
    

module.exports = UnixSocket