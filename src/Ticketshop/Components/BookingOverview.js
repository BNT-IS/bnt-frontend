import React from 'react';
import './TicketOverview.css';
import { Box, Text, Accordion, AccordionPanel } from 'grommet';
import Config from '../../config';
import UserContext from '../../AppContexts/UserContext';

class BestellungsItem extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var ticketsForBooking = [];
        this.props.tickets.forEach((ticket) => {
            ticketsForBooking.push(
                <Box key={ticket.identifier} pad="small">
                    <span>Ticket Identifier: {ticket.identifier}</span>
                    <span>Nachname: {ticket.surname}</span>
                    <span>Vorname: {ticket.forename}</span>
                    <span>Ticket Typ: {ticket.ticketType}</span>
                </Box>
            )
        });
        var buchung = this.props.booking;
        var accPanelLabel = "Buchungs-ID: " + buchung.id + " Buchungsdatum: " + buchung.createdAt + " Bezahldatum: " + buchung.paidAt;
        return (
            <AccordionPanel label={accPanelLabel}>
                <Text margin="small">Folgende Tickets wurden gebucht:</Text>
                {ticketsForBooking}
            </AccordionPanel>
        )
    }

}

class BookingOverview extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.loadListHandler = this.loadListHandler.bind(this);
        this.loadTicketsHandler = this.loadTicketsHandler.bind(this);
        this.state = { buchungen: [], tickets: [] };
    }

    componentDidMount() {
        this.loadListHandler();
    }

    async loadListHandler() {
        this.setState({ loading: true });
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/users/" + this.context.user.id + "/bookings", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).catch(console.log)
        if (!response) return
        console.log(response)
        var data = await response.json().catch(console.log)
        if (!data) return;

        // TODO: Error Handling, wenn data nur eine Message ist... data.message
        this.setState({ buchungen: data, loading: false })
    }

    async loadTicketsHandler(indexOfBooking) {
        if (indexOfBooking === undefined) return;

        let bookingId = this.state.buchungen[indexOfBooking].id;
        let ticketsLoaded = this.state.tickets.findIndex((ticket) => {
            return ticket.bookingId === bookingId
        })

        if (ticketsLoaded !== -1) return;

        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/bookings/" + bookingId + "/ticketsBooked", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).catch(console.log)

        if (!response) return

        var data = await response.json().catch(console.log)

        if (!data) return

        var kopieTickets = this.state.tickets;
        kopieTickets = kopieTickets.concat(data);

        this.setState({ tickets: kopieTickets });
    }

    render() {
        var buchungen = [];
        this.state.buchungen.forEach((buchung) => {
            var filteredTickets = this.state.tickets.filter((ticket) => {
                return ticket.bookingId === buchung.id
            })
            buchungen.push(<BestellungsItem key={buchung.id} booking={buchung} tickets={filteredTickets}></BestellungsItem>)
        });

        return (
            <Box className="BookingOverview" direction="column" gap="medium" pad="medium">
                <Box>
                    {this.state.loading && <p className="loader"></p>}
                    {buchungen.length > 0 &&
                        <Accordion onActive={(activeItems) => { this.loadTicketsHandler(activeItems[0]) }}>
                            {buchungen}
                        </Accordion>
                    }
                    {buchungen.length === 0 &&
                        <Text>Keine Buchungen vorhanden</Text>
                    }
                </Box>
            </Box>
        );
    }
}

export default BookingOverview;
