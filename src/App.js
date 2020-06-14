import React from 'react';
import './App.css';

// @Robin siehe https://reactjs.org/docs/context.html
import UserContext from './AppContexts/UserContext';

import Ticketshop from './Ticketshop/Ticketshop';
import EntranceManagement from './EntranceManagement/EntranceManagement';
import EventManagement from './EventManagement/EventManagement';
import { Grommet, grommet } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";

class App extends React.Component {

  constructor(props) {
    super(props);
    // @Robin Hinzugefügt für globales User Objekt
    this.state = { user: { address: '0x1', email: 'test@fabianbusch.me', role: 0 , auth_token: localStorage.getItem('access_token') } };
  }

  render() {
    console.log(this.state.user);
    return (
      // @Robin Hinzugefügt für globales User Objekt siehe https://reactjs.org/docs/context.html
      <UserContext.Provider value={{ user: this.state.user, logout: () => { this.setState({ user: undefined }) } }}>
        <Grommet theme={grommet}>
          <Switch>
            <Route exact path="/">
              <ul>
                <li><Link to="/guest">Gast</Link></li>
                <li><Link to="/entrance">Einlass-Management</Link></li>
                <li><Link to="/eventmgmt">Event-Management</Link></li>
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
          </Switch>
        </Grommet>
      </UserContext.Provider>
    );
  }
}

export default App;
