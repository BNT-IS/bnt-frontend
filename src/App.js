import React from 'react';
import './App.css';

// @Robin siehe https://reactjs.org/docs/context.html
import UserContext from './AppContexts/UserContext';
import AccountManagement from './AccountManagement/AccountManagement'
import Ticketshop from './Ticketshop/Ticketshop';
import EntranceManagement from './EntranceManagement/EntranceManagement';
import EventManagement from './EventManagement/EventManagement';
import { Grommet, grommet } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";

class App extends React.Component {

  constructor(props) {
    super(props);
    // @Robin Hinzugefügt für globales User Objekt
    this.state = { userContext: {} };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.setState({ userContext: JSON.parse(localStorage.getItem('userContext')) });
    console.log(this.state.userContext);
  }

  logout() {
    this.setState({ userContext: {} }); window.location.assign('#/')
  }

  login() {
    if (this.state.userContext === null) { alert("Bitte melden Sie sich mit ihrem User an oder erstellen Sie einen Account"); window.location.assign('#/Accountmanagement/') };
    if (this.state.userContext.user.role === 0) { alert("Sie wurden erfolgreich als Admin angemeldet"); window.location.assign('#/eventmgmt/') };
    if (this.state.userContext.user.role === 1) { alert("Sie wurden erfolgreich als Gast angemeldet"); window.location.assign('#/guest/') };
  }

  render() {
    console.log(this.state.userContext);
    let test = this.state.userContext;
    test = Object.assign(test, {logout: this.logout, login: this.login, reloadLocalStorage: this.init});
    return (
      // @Robin Hinzugefügt für globales User Objekt siehe https://reactjs.org/docs/context.html
      <UserContext.Provider value={test}>

        <Grommet theme={grommet}>
          <Switch>
            <Route exact path="/">
              <ul>
                <li><Link to="/guest">Ticketshop</Link></li>
                <li><Link to="/entrance">Einlass-Management</Link></li>
                <li><Link to="/eventmgmt">Event-Management</Link></li>
                <li><Link to="/Accountmanagement">Anmelden</Link></li>
              </ul>
            </Route>
          </Switch>
          <Switch>
            <Route path="/guest">
              <Ticketshop eigenschaft1="test"></Ticketshop>
            </Route>
            <Route path="/entrance">
              <EntranceManagement></EntranceManagement>
            </Route>
            <Route path="/eventmgmt">
              <EventManagement></EventManagement>
            </Route>
            <Route path="/Accountmanagement">
              <AccountManagement></AccountManagement>
            </Route>
          </Switch>
        </Grommet>
      </UserContext.Provider>
    );
  }
}

export default App;
