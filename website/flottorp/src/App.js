import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import MiddleButtons from './components/MiddleButtons';
import BotStats from "./components/BotStats";
import BotLogin from "./components/BotLogin";
import Header from "./components/Header"


function App() {
  return (
    <div className="App">
      <Header />
      <BotStats />
      <Router>
        <Switch>
          <Route exact path="/">
            <MiddleButtons />
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
