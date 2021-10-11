var React = require('react');
var ReactDOM = require('react-dom');

module.exports = function(data) {
  var container = document.getElementById('root');
  ReactDOM.render(data, container);
};
