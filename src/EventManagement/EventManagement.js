import React from 'react';
import { Box, Header, Menu } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";
import EntranceDashboard from './Components/EntranceDashboard';
import TicketReaderManager from './Components/TicketReaderManager';
import ShopManagement from './Components/ShopManagement';
import UserContext from '../AppContexts/UserContext';

import LocalTicketMirror from './Classes/LocalTicketMirror';

// eslint-disable-next-line
import RemoteTicketReader from './Classes/RemoteTicketReader';

class EventManagement extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.rTRHandler = this.rTRHandler.bind(this);

        // Required code for offline ticket data sync
        this.localTicketMirror = new LocalTicketMirror();

        // RTRList should be an array of remoteTicketReaders
        this.state = { RTRList: [] };
    }

    // FOR LOGIN

    componentWillMount(){
        this.context.requireLogin(0);
    }

    componentWillUpdate(){
        this.context.requireLogin(0);
    }

    // END: FOR LOGIN

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
        remoteTicketReader.onConnectionChanged = (connectionState) => {
            switch (connectionState) {
                case "connected":
                    // The connection has become fully connected
                    break;
                case "disconnected":
                    break;
                case "failed":
                    // One or more transports has terminated unexpectedly or in an error
                    this.removeRTR(remoteTicketReader);
                    break;
                case "closed":
                    // The connection has been closed
                    break;
                default:
                    break;
            }
            this.forceUpdate();
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
        remoteTicketReader.onObliterateTicket = (identifier, secretIngredient, callback) => {
            this.localTicketMirror.obliterateTicket(identifier, secretIngredient).then((result) => {
                callback(result);
            }).catch((error) => {
                callback(null, error)
            });
        }
    }

    removeRTR(remoteTicketReader) {
        console.debug("Attempting to remove closed remote ticket reader");
        let RTRList = this.state.RTRList;
        let idx = RTRList.indexOf(remoteTicketReader);
        RTRList.splice(idx, 1);
        this.setState({ RTRList: RTRList });
    }

    render() {
        return (

            <Box className="EventManagement">
                <Header background="brand" justify="between" pad="10px">
                    <Link to="/eventmgmt">Home</Link>
                    <Menu label="Account" items={[{ label: 'Logout', onClick: this.context.logout }]} />
                </Header>
                <Box className="left-right-grid" direction="row" justify="start" wrap={true}>
                    <Box className="sidebar">
                        <ul>
                            <li><Link to="/eventmgmt/rtrm">Manage Remote Ticket Readers</Link></li>
                            <li><Link to="/eventmgmt/entrancedb">Entrance Dashboard</Link></li>
                            <li><Link to="/eventmgmt/shop">Shop Management</Link></li>
                        </ul>
                    </Box>
                    <Box className="main-content">
                        <Switch>
                            <Route path="/eventmgmt/rtrm">
                                <TicketReaderManager RTRList={this.state.RTRList} onRTR={this.rTRHandler}></TicketReaderManager>
                            </Route>
                            <Route path="/eventmgmt/entrancedb">
                                <EntranceDashboard localTicketMirror={this.localTicketMirror} onRemoveRTR={() => { }}></EntranceDashboard>
                            </Route>
                            <Route path="/eventmgmt/shop">
                                <ShopManagement></ShopManagement>
                            </Route>
                        </Switch>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default EventManagement;
