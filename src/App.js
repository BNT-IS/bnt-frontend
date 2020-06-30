import React from 'react';
import './App.css';

import UserContext from './AppContexts/UserContext';
import Login from './AccountManagement/Login';
import SystemSetup from './SystemSetup/SystemSetup';
import Ticketshop from './Ticketshop/Ticketshop';
import Entrance from './Entrance/Entrance';
import EventManagement from './EventManagement/EventManagement';
import { Grommet, grommet } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";

import config from './config';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { userContext: null };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    let ls = JSON.parse(localStorage.getItem('userContext'));
    this.setState({ userContext: ls ? ls : null }, this.login);
  }

  logout() {
    if (this.state.userContext.user.role === 0) {
      let ok = window.confirm('Sollen auch eventuell lokal gespeicherten Daten für den Einlass unwiederruflich gelöscht werden?', "Nein");
      if (ok) {
        window.indexedDB.deleteDatabase(config.IDB_NAME);
      }
    }
    localStorage.clear();
    this.setState({ userContext: null });
    window.location.assign('#/login');
  }

  login() {
    if (this.state.userContext === null) {
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
      <UserContext.Provider value={Object.assign(this.state.userContext ? this.state.userContext : {}, { logout: this.logout, login: this.login, reloadLocalStorage: this.init })}>

        <Grommet theme={grommet}>
          <Switch>
            <Route exact path="/">
              <ul>
                <li><Link to="/guest">Ticketshop</Link></li>
                <li><Link to="/entrance">Einlass</Link></li>
                <li><Link to="/eventmgmt">Event-Management</Link></li>
                <li><Link to="/setup">System-Setup</Link></li>
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
            <Route path="/setup">
              <SystemSetup></SystemSetup>
            </Route>
            <Route path="/login">
              <Login></Login>
            </Route>
          </Switch>
        </Grommet>
      </UserContext.Provider>
    );
  }
}

export default App;
