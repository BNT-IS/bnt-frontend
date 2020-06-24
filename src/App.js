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
    this.state = { user: { id: null, email: null, role: null, access_token: null } };
  }

  componentDidMount(){
    this.init();
  }

  init(){
    this.setState({user: { id: localStorage.getItem('user_id'), email: localStorage.getItem('user_email'), role: localStorage.getItem('user_role'), 
    access_token: localStorage.getItem('access_token')}});
  }

  render() {
    console.log(this.state.user);
    return (
      // @Robin Hinzugefügt für globales User Objekt siehe https://reactjs.org/docs/context.html
      <UserContext.Provider value={{ user: this.state.user, logout: () => { this.setState({ user: {id: null, email: null, role: null, access_token: null}}) }, 
      login: () => {if(this.state.user.role === null){alert("Bitte melden Sie sich mit ihrem User an oder erstellen Sie einen Account"); window.location.assign('#/Accountmanagement/') }; 
      if(this.state.user.role === "0"){alert("Sie wurden erfolgreich als Admin angemeldet"); window.location.assign('#/eventmgmt/') }; 
      if(this.state.user.role === "1"){alert("Sie wurden erfolgreich als Gast angemeldet"); window.location.assign('#/guest/') };}}}> 
        
        <Grommet theme={grommet}>
          <Switch>
            <Route exact path="/">
              <ul>
                <li><Link to="/guest">Gast</Link></li>
                <li><Link to="/entrance">Einlass-Management</Link></li>
                <li><Link to="/eventmgmt">Event-Management</Link></li>
                <li><Link to="/Accountmanagement">Accountmanagement</Link></li>
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
