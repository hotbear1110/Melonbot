const React = require('react');
const ReactDOMServer = require("react-dom/server")
import { Component } from "react";
import Header from "./Header"
// Modified version of static react header. i cba to create it in vanilla css.


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
    return(
    <>
        <Header />
        <table className="commandsTable">
            <tr className="TableHeader">
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Perm</th>
            </tr>
            {commandTable}
        </table>
    </>
    );
}

module.exports = class Commands extends Component {
    render() {

        var data = this.props.data

        var table = CommandList(data)
        
        var rootHtml = ReactDOMServer.renderToString(table);

        var initScript = 'main(' + JSON.stringify(table).replace(/script/g, 'src'+'ipt') + ')';

        return (
            <html>
            <head>
                <link rel="stylesheet" href="/public/css/commands.css"></link>
                <link rel="stylesheet" href="/public/css/header.css"></link>
                <title>Commands</title>
            </head>
            <body>
                <div id="root" dangerouslySetInnerHTML={{__html: rootHtml}}/>

                <script src="./Render.jsx"/>
                <script dangerouslySetInnerHTML={{__html: initScript}}/>
            </body>
            </html>
        )
    }
}
