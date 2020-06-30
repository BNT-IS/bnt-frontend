import React from 'react';
import './App.css';

import UserContext from './AppContexts/UserContext';
import Login from './AccountManagement/Login';
import SystemSetup from './SystemSetup/SystemSetup';
import Ticketshop from './Ticketshop/Ticketshop';
import Entrance from './Entrance/Entrance';
import EventManagement from './EventManagement/EventManagement';
import { Grommet, grommet, Box, Heading } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";

import config from './config';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { userContext: null, setupMode: false };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {

    // Check system status once mounted
    this.detectSystemState();

    // Check system status frequently (currently every 60 seconds)
    window.setInterval(() => {
      this.detectSystemState();
    }, 60000);

    // For login stuff
    this.init();
  }

  async detectSystemState() {
    try {
      var response = await fetch(config.BACKEND_BASE_URI, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      })
      if (response.status === 200) {
        this.setState({ setupMode: false });
      } else {
        this.setState({ setupMode: true });
      }
    } catch (error) {
      console.log(error);
    }
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
          {!this.state.setupMode &&
            <Box>
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
                  <Login></Login>
                </Route>
                <Route path="/">
                  <ul>
                    <li><Link to="/guest">Ticketshop</Link></li>
                    <li><Link to="/entrance">Einlass</Link></li>
                    <li><Link to="/eventmgmt">Event-Management</Link></li>
                    <li><Link to="/login">Anmelden</Link></li>
                  </ul>
                </Route>
              </Switch>
            </Box>
          }
          {this.state.setupMode &&
            <Box>
              <Switch>
                <Route path="/setup">
                  <SystemSetup></SystemSetup>
                </Route>
                <Route path="/">
                  <Box pad="medium" alignContent="center" direction="column" align="center">
                    <Heading>Wartungsarbeiten</Heading>
                    <p>
                      Sehr geehrte Besucher*innen,<br />
                      das Bachelorsnight Ticketsystem befindet sich derzeit im Wartungsmodus.<br />
                      Bitte versuchen Sie es später erneut.
                    </p>
                  </Box>
                </Route>
              </Switch>
            </Box>
          }
        </Grommet>

      </UserContext.Provider>
    );
  }
}

export default App;
