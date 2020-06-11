import React from 'react';
import { Menu, Header, Box } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";
import WalletSetup from './Components/WalletSetup';
import UserMainMenu from './Components/UserMainMenu';
import TicketOverview from './Components/TicketOverview';
import AccountManagement from './Components/AccountManagement';
import Bestellungsuebsericht from './Components/Bestellungsuebsericht';

class Ticketshop extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Box className="Guest">
                <Header background="brand" justify="between" pad="10px">
                    <Link to="/guest">Home</Link>
                    <Menu label="Account" items={[{ label: 'Logout' }]} />
                </Header>
                <Switch>
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
                        <Bestellungsuebsericht></Bestellungsuebsericht>
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
