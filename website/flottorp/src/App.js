import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import MiddleButtons from './components/MiddleButtons';
import BotMain from "./components/BotMain"
import BotStats from "./components/BotStats";
import BotLogin from "./components/BotLogin";


function App() {
  return (
    <div className="App">
      <BotStats />
      <Router>
        <Switch>
          <Route exact path="/">
            <MiddleButtons />
          </Route>
          <Route exact path="/bot">
            <BotMain />
          </Route>
          <Route exact path="/bot/login">
            <BotLogin />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
