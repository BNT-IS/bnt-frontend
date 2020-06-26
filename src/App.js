import React from 'react';
import './App.css';

import UserContext from './AppContexts/UserContext';
import AccountManagement from './AccountManagement/AccountManagement'
import Ticketshop from './Ticketshop/Ticketshop';
import Entrance from './Entrance/Entrance';
import EventManagement from './EventManagement/EventManagement';
import { Grommet, grommet } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";

import config from './config';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { userContext: {} };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    let ls = JSON.parse(localStorage.getItem('userContext'));
    this.setState({ userContext: ls ? ls : {} }, this.login);
  }

  logout() {
    localStorage.clear();
    window.indexedDB.deleteDatabase(config.IDB_NAME);
    this.setState({ userContext: {} });
    window.location.assign('#/login');
  }

  login() {
    if (!this.state.userContext.user) {
      window.location.assign('#/login/');
    } else {
      if (this.state.userContext.user.role === 0 && (window.location.hash === "" || window.location.hash.includes('login'))) {
        window.location.assign('#/eventmgmt/');
      }
      if (this.state.userContext.user.role === 1 && (window.location.hash === "" || !window.location.hash.includes('guest') || window.location.hash.includes("login"))) {
        window.location.assign('#/guest/');
      }
    }
  }

  render() {
    return (
      <UserContext.Provider value={Object.assign(this.state.userContext, { logout: this.logout, login: this.login, reloadLocalStorage: this.init })}>

        <Grommet theme={grommet}>
          <Switch>
            <Route exact path="/">
              <ul>
                <li><Link to="/guest">Ticketshop</Link></li>
                <li><Link to="/entrance">Einlass-Management</Link></li>
                <li><Link to="/eventmgmt">Event-Management</Link></li>
                <li><Link to="/login">Anmelden</Link></li>
              </ul>
            </Route>
          </Switch>
          <Switch>
            <Route path="/guest">
              <Ticketshop eigenschaft1="test"></Ticketshop>
            </Route>
            <Route path="/entrance">
              <Entrance></Entrance>
            </Route>
            <Route path="/eventmgmt">
              <EventManagement></EventManagement>
            </Route>
            <Route path="/login">
              <AccountManagement></AccountManagement>
            </Route>
          </Switch>
        </Grommet>
      </UserContext.Provider>
    );
  }
}

export default App;
