const { Component } = require('react');
const React = require('react');
import Header from "./Header"
// This is identical to the Header component in the static React App.

function CommandList(commands) {
    // Pipe every command into a table row element
    const commandTable = commands.map((command) =>
    <tr key={command.id} id="commandRow">  
        <th scope="row">{command.id}</th>
        <td>{command.name}</td>
        <td>{command.description}</td>
        <td>{command.perm}</td>
    </tr>
    )
    return commandTable;
}

module.exports = class Commands extends Component {
// module.exports = function Commands(props) {
    constructor(props) {
        super(props)

        this.state = {
            commands: props.commands
        }
    }
    

    render() {

        const { commands } = this.state

        return (
            <html>
            <head>
                <link rel="stylesheet" href="/public/css/commands.css"></link>
                <title>Commands</title>
            </head>
            <body>
                <Header />
                <table className="commandsTable">
                    <tr className="TableHeader">
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Perm</th>
                    </tr>
                    {CommandList(commands)}
                </table>
            </body>
            </html>
        )
    } 
}
