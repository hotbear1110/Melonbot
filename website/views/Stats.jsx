const React = require('react');
const ReactDOMServer = require("react-dom/server")
import { Component } from "react";

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
