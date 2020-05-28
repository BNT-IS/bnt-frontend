import React from 'react';
import { Box, Button } from 'grommet';

// eslint-disable-next-line
import { LocalTicketMirror } from '../Classes/LocalTicketMirror';


class IndexedDBExample extends React.Component {

    constructor(props) {
        super(props);
        this.state = { tickets: [] };
        this.handleDumpMirror = this.handleDumpMirror.bind(this);
        this.showTickets = this.showTickets.bind(this);
        if (!this.props.localTicketMirror) throw new Error("Missing LocalTicketMirror");
        this.showTickets();
    }

    handleDumpMirror() {
        /**
         * @type LocalTicketMirror
         */
        let ltm = this.props.localTicketMirror;
        ltm.dumpTicketMirror();
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
        let tickets = this.state.tickets.map((ticket) => {
            return <li key={ticket.identifier}>{ticket.isValid && 'Valid'}{!ticket.isValid && 'Not Valid'} -  {ticket.isUsed && 'Used'}{!ticket.isUsed && 'Not Used'} - {ticket.ticketType}</li>
        });

        return (
            <Box className="IndexedDBExample" pad="medium">
                <ul>
                    {tickets}
                </ul>
                <Button label="Dump Mirror" onClick={this.handleDumpMirror}></Button>
            </Box>
        );
    }
}

export default IndexedDBExample;
