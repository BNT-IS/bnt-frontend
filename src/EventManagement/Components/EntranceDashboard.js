import React from 'react';
import { Box, Button, List } from 'grommet';

// eslint-disable-next-line
import LocalTicketMirror from '../Classes/LocalTicketMirror';

import UserContext from '../../AppContexts/UserContext';
import Config from '../../config';

class EntranceDashboard extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = { tickets: [] };
        this.handleDumpMirror = this.handleDumpMirror.bind(this);
        this.showTickets = this.showTickets.bind(this);
        if (!this.props.localTicketMirror) throw new Error("Missing LocalTicketMirror");
        this.showTickets();
    }

    async handleDumpMirror() {
        /**
         * @type LocalTicketMirror
         */
        let ltm = this.props.localTicketMirror;

        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/tickets/", {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).catch(console.log);

        if (!response.ok) {
            this.setState({ loading: false });
            return alert('Beim Laden der Tickets ist ein Fehler aufgetreten.');
        }

        var tickets = await response.json().catch(console.log);

        if (!tickets) return alert('Beim Laden der Tickets ist ein Fehler aufgetreten.');

        ltm.saveTicketMirror(tickets);

        this.showTickets();
    }

    async showTickets() {
        // Reading out of idb all tickets
        /**
         * @type LocalTicketMirror
         */
        let ltm = this.props.localTicketMirror;
        let tickets = await ltm.getTicketList().catch(console.error);
        if (!tickets) return;

        this.setState({ tickets });
    }

    render() {
        return (
            <Box className="EntranceDashboard" pad="medium" gap="small">
                <Button label="Ticketdaten für den Offline-Einlass herunterladen" onClick={this.handleDumpMirror}></Button>
                <List
                    primaryKey="surname"
                    secondaryKey="forename"
                    data={this.state.tickets}
                />
            </Box>
        );
    }
}

export default EntranceDashboard;
