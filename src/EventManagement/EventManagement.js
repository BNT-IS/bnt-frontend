import React from 'react';
import { Box } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";
import IndexedDBExample from './Components/IndexedDBExample';
import TicketReaderManager from './Components/TicketReaderManager';

class EventManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Box className="EventManagement">
                <ul>
                    <li><Link to="/eventmgmt/rtrm">Manage Remote Ticket Readers</Link></li>
                    <li><Link to="/eventmgmt/entrancedb">Show Entrance Dashboard</Link></li>
                    <li><Link to="/eventmgmt/ticketshop">Manage Ticketshop</Link></li>
                </ul>
                <Switch>
                    <Route path="/eventmgmt/rtrm">
                        <TicketReaderManager></TicketReaderManager>
                    </Route>
                    <Route path="/eventmgmt/entrancedb">
                        <IndexedDBExample></IndexedDBExample>
                    </Route>
                    <Route path="/eventmgmt/ticketshop">
                        <Box pad="medium">Hier müsste dann sowas wie ein Ticketshop Management Dashboard hin...</Box>
                    </Route>
                </Switch>
            </Box>
        );
    }
}

export default EventManagement;
