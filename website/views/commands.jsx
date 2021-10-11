const React = require('react');

module.exports = function Commands(props) {

  // Pipe every command into a table row element
  const commandTable = props.commands.map((command) =>
    <tr key={command.id}>  
      <th scope="row">{command.id}</th>
      <td>{command.name}</td>
      <td>{command.description}</td>
      <td>{command.perm}</td>
    </tr>
    )

  return (
    <html>
    <head>
      <link rel="stylesheet" href="/public/css/commands.css"></link>
      <title>Commands</title>
    </head>
    <body>
      <table className="commandsTable">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Perm</th>
        </tr>
        {commandTable}
      </table>
    </body>
    </html>
  )
}
