import React from 'react';
import { Box, Button, List, CheckBox, Clock, Meter, Stack, Text } from 'grommet';

// eslint-disable-next-line
import LocalTicketMirror from '../Classes/LocalTicketMirror';

import UserContext from '../../AppContexts/UserContext';
import Config from '../../config';

class EntranceDashboard extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = { lockDataset: false, tickets: [] };
        this.handleDumpMirror = this.handleDumpMirror.bind(this);
        this.showTickets = this.showTickets.bind(this);
        this.lockHandler = this.lockHandler.bind(this);
        this.validTicketsCount = this.validTicketsCount.bind(this);
        this.usedTicketsCount = this.usedTicketsCount.bind(this);
        if (!this.props.localTicketMirror) throw new Error("Missing LocalTicketMirror");

        // Reloading ticket list at each db change
        // This could be inperformant with more ticket-reader at once
        // Maybe a frequent polling mechanism would be better
        this.props.localTicketMirror.onTicketListChanged = this.showTickets;
    }

    componentDidMount() {
        this.showTickets();
    }

    translateTicketType(ticketType) {
        switch (ticketType) {
            case "0": return "Absolvent";
            case "1": return "Begleitperson";
            case "2": return "Parkticket";
            default: break;
        }
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

        this.setState({ tickets, lockDataset: (tickets.length > 0 ? true : false) });
    }

    lockHandler(event) {
        if (!event.target.checked) {
            let ok = window.confirm('Sind Sie sich sicher, dass sie den Datensatz erneut herunterladen möchten? Sie werden alle Daten zu bisher eingelösten Tickets verlieren.');
            if (ok) {
                this.setState({ lockDataset: event.target.checked });
            }
        } else {
            this.setState({ lockDataset: event.target.checked });
        }
    }

    validTicketsCount() {
        let validTickets = this.state.tickets.filter(ticket => ticket.isValid);
        return validTickets.length;
    }

    usedTicketsCount() {
        let usedTicketsCount = this.state.tickets.filter(ticket => ticket.isUsed);
        return usedTicketsCount.length;
    }


    render() {

        const usedTicketsCount = this.usedTicketsCount();
        const unusedTicketsCount = this.state.tickets.length - usedTicketsCount;

        return (
            <Box className="EntranceDashboard" pad="medium" gap="small" direction="column" wrap={true}>
                <Box className="dashboardHead" direction="row" wrap={true} justify="center">
                    <Clock type="digital" size="xxlarge" />
                </Box>
                <Box className="dashboardRow1" direction="row" wrap={true} justify="center" gap="small">
                    <Box className="dataControls" direction="column" gap="small" justify="center">
                        <Button alignSelf="center" label="Ticketdaten für den Offline-Einlass herunterladen" onClick={this.handleDumpMirror} disabled={this.state.lockDataset}></Button>
                        <CheckBox label="Datensatz schützen" toggle={true} onChange={this.lockHandler} checked={this.state.lockDataset}></CheckBox>
                    </Box>
                    <Box className="StatisticalSummary" direction="column" wrap={false}>
                        <p>Anzahl unbenutzte Tickets</p>
                        <Stack>
                            <Meter
                                type="bar"
                                values={[{
                                    value: unusedTicketsCount,
                                    label: 'Anzahl gültige Tickets'
                                }]}
                                aria-label="meter"
                                max={this.state.tickets.length}
                                thickness="large"
                            />
                            <Text size="2em" margin="0.2em" alignSelf="center">{unusedTicketsCount}</Text>
                        </Stack>
                        <p>Anzahl eingetreten</p>
                        <Stack>
                            <Meter
                                type="bar"
                                values={[{
                                    value: usedTicketsCount,
                                    label: 'Anzahl eingetreten'
                                }]}
                                aria-label="meter"
                                max={this.state.tickets.length}
                                thickness="large"
                            />
                            <Text size="2em" margin="0.2em" alignSelf="center">{usedTicketsCount}</Text>
                        </Stack>
                    </Box>
                </Box>
                <Box className="TicketList">
                    <List
                        primaryKey={(ticket) => { return <b key={ticket.identifier + 't'}>{ticket.surname || 'Unkown'}, {ticket.forename || 'Unkown'} - {this.translateTicketType(ticket.ticketType)} {ticket.isWheelchairUser ? '!Rollstuhlfahrer!' : ''}</b> }}
                        secondaryKey={(ticket) => { return <span key={ticket.identifier + 's'}>{ticket.isValid ? 'gültig' : 'ungültig'} - {ticket.isUsed ? 'benutzt' : 'unbenutzt'}</span> }}
                        data={this.state.tickets}
                    />
                </Box>
            </Box>
        );
    }
}

export default EntranceDashboard;
