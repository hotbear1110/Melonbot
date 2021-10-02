import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import MiddleButtons from './components/MiddleButtons';


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <MiddleButtons />
          </Route>
          <Route exact path="/bot">
            <p>Bot</p>
          </Route>
          <Route exact path="/bot/login">
            <p>Bot Login</p>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
