import React from 'react';

import UserContext from '../AppContexts/UserContext';

import { Menu, Header, Box } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";
import UserMainMenu from './Components/UserMainMenu';
import TicketOverview from './Components/TicketOverview';
import BookingOverview from './Components/BookingOverview';
import TicketBestellung from './Components/TicketBestellung';

class Ticketshop extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {};
    }


    // FOR LOGIN

    componentDidMount() {
        this.context.requireLogin(1);
    }

    componentDidUpdate() {
        this.context.requireLogin(1);
    }

    // END: FOR LOGIN

    render() {
        return (
            <Box className="Guest">
                <Header background="brand" justify="between" pad="10px">
                    <Link to="/guest">Home</Link>
                    <Menu label="Account" items={[{ label: 'Logout', onClick: this.context.logout }]} />
                </Header>
                <Switch>
                    <Route path="/guest/buy">
                        <TicketBestellung></TicketBestellung>
                    </Route>
                    <Route path="/guest/tickets/">
                        <TicketOverview></TicketOverview>
                    </Route>
                    <Route path="/guest/bookings">
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
