import React from 'react';
import './App.css';
import Guest from './Guest/Guest';
import EntranceManagement from './EntranceManagement/EntranceManagement';
import EventManagement from './EventManagement/EventManagement';
import { Grommet, grommet } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      account: null
    };
    this.scanDoneHandler = this.scanDoneHandler.bind(this);
    this.obliterateTokens = this.obliterateTokens.bind(this);
    //this.scanDoneHandler("0x9a2f730AFd66E990567AFc09665bE014EB76FAeB");
  }

  errorDisplay(msg) {
    alert('Sorry, there was an error. Please try again.');
  }

  scanDoneHandler(address) {
    this.getAccountDetails(address).then((details) => {
      if (!details.verified) {
        return alert('Account nicht für TBN-Nutzung verifiziert');
      }

      this.getAccountBalance(address).then((balance) => {
        const st = this.state;
        st.account = {
          address: address,
          balance: balance,
          verified: details.verified,
          paidTickets: details.paidTickets,
          poolTickets: details.poolTickets,
          parkTickets: details.parkTickets
        };
        this.setState(st);
      })
    });
  }

  async getAccountBalance(address) {
    // Fetch current token balance
    const response = await fetch('http://localhost:3000/balanceOf?address=' + address, {
      method: 'GET',
      //headers: myHeaders,
      mode: 'cors',
      cache: 'no-cache',
    }).catch(this.errorDisplay);
    const data = await response.json().catch(this.errorDisplay);
    return data;
  }

  async getAccountDetails(address) {
    // Fetch current token balance
    const response = await fetch('http://localhost:3000/accountDetails?address=' + address, {
      method: 'GET',
      //headers: myHeaders,
      mode: 'cors',
      cache: 'no-cache',
    }).catch(this.errorDisplay);
    const data = await response.json().catch(this.errorDisplay);
    return data;
  }

  obliterateTokens(number) {
    let prom = new Promise((resolve, reject) => {
      setTimeout(() => { resolve('Übertragen'); this.scanDoneHandler(null) }, 3000); // DUMMY
      // Call transferFrom address to obliterate-wallet
    });

    return prom;
  }

  render() {
    return (
      <Grommet theme={grommet}>
        <Switch>
          <Route exact path="/">
            <ul>
              <li><Link to="/guest">Gast</Link></li>
              <li><Link to="/entrancemgmt">Einlass-Management</Link></li>
              <li><Link to="/eventmgmt">Event-Management</Link></li>
            </ul>
          </Route>
        </Switch>
        <Switch>
          <Route path="/guest">
            <Guest></Guest>
          </Route>
          <Route path="/entrance">
            <EntranceManagement></EntranceManagement>
          </Route>
          <Route path="/eventmgmt">
            <EventManagement></EventManagement>
          </Route>
        </Switch>
      </Grommet>
    );
  }
}

export default App;
