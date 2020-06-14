import React from 'react';

// @Robin Hier mal eine externe js Datei für so Kontext kram...
import UserContext from '../AppContexts/UserContext';

import { Menu, Header, Box } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";
import WalletSetup from './Components/WalletSetup';
import UserMainMenu from './Components/UserMainMenu';
import TicketOverview from './Components/TicketOverview';
import AccountManagement from './Components/AccountManagement';
import BookingOverview from './Components/BookingOverview';
import TicketBestellung from './Components/TicketBestellung';

class Ticketshop extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    // @Robin Nutze Usercontext so: static contextType = UserContext;

    render() {
        return (
            <Box className="Guest">
                <Header background="brand" justify="between" pad="10px">
                    <Link to="/guest">Home</Link>
                    {
                        // @Robin Nutze Usercontext oder so:
                        <UserContext.Consumer>
                            {userContext => <Menu label="Account" items={[{ label: 'Logout', onClick: userContext.logout }]} />}
                        </UserContext.Consumer>
                    }
                </Header>
                <Switch>
                    <Route path="/guest/ticketbestellen">
                        <TicketBestellung></TicketBestellung>
                    </Route>
                    <Route path="/guest/tickets/">
                        <TicketOverview></TicketOverview>
                    </Route>
                    <Route path="/guest/setup">
                        <AccountManagement></AccountManagement>
                    </Route>
                    <Route path="/guest/demosetup">
                        <WalletSetup></WalletSetup>
                    </Route>
                    <Route path="/guest/bestellungsuebersicht">
                        <BookingOverview></BookingOverview>
                    </Route>
                    <Route path="/guest/">
                        <UserMainMenu></UserMainMenu>
                    </Route>
                </Switch>
            </Box>
        );
    }
}

export default Ticketshop;
