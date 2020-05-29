import React from 'react';
import { Box } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";
import IndexedDBExample from './Components/IndexedDBExample';
import TicketReaderManager from './Components/TicketReaderManager';

import LocalTicketMirror from './Classes/LocalTicketMirror';

// eslint-disable-next-line
import RemoteTicketReader from './Classes/RemoteTicketReader';

class EventManagement extends React.Component {

    constructor(props) {
        super(props);
        this.rTRHandler = this.rTRHandler.bind(this);

        // Required code for offline ticket data sync
        this.localTicketMirror = new LocalTicketMirror();

        // RTRList should be an array of remoteTicketReaders
        this.state = { RTRList: [] };
    }

    /**
     * Handler for new connected remote ticket readers
     * @param {RemoteTicketReader} remoteTicketReader 
     */
    rTRHandler(remoteTicketReader) {
        // Adding the remote ticket reader to the list
        let RTRList = this.state.RTRList;
        RTRList.push(remoteTicketReader);
        this.setState({ RTRList: RTRList });

        // In case the rtr is dicsonnected, it should be removed from the list in the view state
        remoteTicketReader.onDisconnected = () => {
            console.debug("Attempting to remove closed remote ticket reader");
            let RTRList = this.state.RTRList;
            let idx = RTRList.indexOf(remoteTicketReader);
            RTRList.splice(idx, 1);
            this.setState({ RTRList: RTRList });
        }

        // Setting eventhandler for reading a ticket
        remoteTicketReader.onGetTicket = (identifier, callback) => {
            // Trying to get the ticket from the IDB
            this.localTicketMirror.getTicket(identifier).then((ticket) => {
                callback(ticket);
            }).catch((error) => { 
                // In case of an error, providing an error msg
                callback(null, error);
            });
        }

        // Setting eventhandler for obliterating a ticket
        remoteTicketReader.onObliterateTicket = (identifier, signature, callback) => {
            // TODO: Request localmirror 
            callback(true);
        }
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
                        <TicketReaderManager RTRList={this.state.RTRList} onRTR={this.rTRHandler}></TicketReaderManager>
                    </Route>
                    <Route path="/eventmgmt/entrancedb">
                        <IndexedDBExample localTicketMirror={this.localTicketMirror}></IndexedDBExample>
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
