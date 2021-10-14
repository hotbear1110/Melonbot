// This does nothing for now. Until i create the software that will be listening on this socket port. Unix based system only. Uses unix socket.

var net = require('net');

// Our socket
const SOCKETFILE = '/tmp/EPSNodeSocketMarkov.sock';

class UnixSocket {
    connect() {
        this.client = net.createConnection(SOCKETFILE)
            .on('connect', () => {
                console.log("Connected");
            })
            .on('error', (error) => {
                console.log(error.code, 'SOCKET ERROR')
                return false
            })
        return true;
    }
    
    // Close connection, do this on SIGINT, which is triggered by nodemon, pm2 etc
    // For hopefully a graceful disconnection.
    close() {
        this.client.destroy()
    }
    
    async write(message) {
        this.client.write(message)
        await this.client.on('close')
    }
}    
    

module.exports = UnixSocket