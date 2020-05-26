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
                    <li><Link to="/eventmgmt/trm">Manage Remote Ticket Readers</Link></li>
                    <li><Link to="/eventmgmt">Show Entrance Dashboard</Link></li>
                </ul>
                <Switch>
                    <Route path="/eventmgmt/trm">
                        <TicketReaderManager></TicketReaderManager>
                    </Route>
                    <Route path="/eventmgmt">
                        <IndexedDBExample></IndexedDBExample>
                    </Route>
                </Switch>
            </Box>
        );
    }
}

export default EventManagement;
