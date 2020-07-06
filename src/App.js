import React from 'react';
import './App.css';

import UserContext from './AppContexts/UserContext';
import Login from './Authentication/Login';
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
    this.logout = this.logout.bind(this);
    this.initUserContext = this.initUserContext.bind(this);
    this.setUserContext = this.setUserContext.bind(this);
    this.checkUserContext = this.checkUserContext.bind(this);
    this.redirectUserToHome = this.redirectUserToHome.bind(this);
  }

  UNSAFE_componentWillMount() {
    // Check system status once mounted
    this.detectSystemState();

    // Check system status frequently (currently every 60 seconds)
    window.setInterval(() => {
      this.detectSystemState();
      this.detectAuthState(this.state.userContext);
    }, 60000);

    // Initialize userContext
    this.initUserContext();
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

  /**
   * Tries to fetch the data of the user to check if the api token works
   * @param {*} userData 
   */
  async detectAuthState(userData) {
    // Try token
    try {
      var response = await fetch(config.BACKEND_BASE_URI + "/api/v2/users/" + userData.user.id, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          Authorization: 'Bearer ' + userData.token
        }
      })
      if (response.status === 401) {
        this.clearUserContext();
        this.setState({ userContext: null });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Loads the data of the user from LocalStorage into the UserContext
   */
  initUserContext() {
    let userData = JSON.parse(localStorage.getItem('userContext'));
    this.setState({ userContext: userData });
    this.detectAuthState(userData);
  }

  /**
   * Sets the current UserContext to new data
   * @param {*} userData 
   */
  setUserContext(userData) {
    localStorage.setItem('userContext', JSON.stringify(userData));
    this.setState({ userContext: userData });
  }

  /**
   * Clears LocalStorage and the UserContext object
   */
  clearUserContext() {
    localStorage.clear();
    this.setState({ userContext: null });
  }

  /**
   * Deletes data to prevent from reuse of the token and userdata
   * finally redirects to login
   */
  logout() {
    if (this.state.userContext && this.state.userContext.user.role === 0) {
      let ok = window.confirm('Sollen auch eventuell lokal gespeicherten Daten für den Einlass unwiederruflich gelöscht werden?', "Nein");
      if (ok) {
        window.indexedDB.deleteDatabase(config.IDB_NAME);
      }
    }
    this.clearUserContext();
    window.location.assign('#/login');
  }

  /**
   * Method that checks if the user is logged in. For use in subcomponents
   * @param {Number} requiredRole - The role that is required
   */
  checkUserContext(requiredRole){
    if (!this.state.userContext || this.state.userContext.user.role > requiredRole) {
      window.location.assign('#/login/');
    }
  }

  redirectUserToHome(){
    if (this.state.userContext && this.state.userContext.user.role === 0) {
      window.location.assign('#/eventmgmt/');
      return;
    }
    if(this.state.userContext && this.state.userContext.user.role === 1) {
      window.location.assign('#/guest/');
      return;
    }
  }

  render() {
    return (
      <UserContext.Provider value={Object.assign(this.state.userContext ? this.state.userContext : {}, { logout: this.logout, setUserContext: this.setUserContext, requireLogin: this.checkUserContext , redirectUserToHome: this.redirectUserToHome })}>
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
