import React from 'react';
import './TicketOverview.css';
import { Box, Text, Accordion, AccordionPanel } from 'grommet';
import Config from '../../config';

class BestellungsItem extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
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
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/users/1/bookings", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 91ba3c0f6ae8d56c4714260a8dbb7c6ce606797be4fb79eedfc73e4d6f212d255487b44e9c1b264deca11183605744c4c8c70d01b097872b41551c7a5dc8af3b7b7f755388835c67b8b094de2253e9ac95850e0575717ea5c3a9efa7239a0adaa70f6fcffec09f4b25ee4b6118fe0e9483f0d3faf8be0976a608460b0ad2156c0ddcc5f483db50404c2f6567b16a6087682d10c4ec22935be53f164a206d3f592baad81c301496b5ff5fca105e65a4121e1f0ae327d9eb5ae8f3f754fdbe7187f6a83e9e6fbe789268d8292521760e1b3f1dcb2a162b55a5b8b8089b21b996e1875f14b0b705a9cbcc806f4f3c4ac229cd3740175b0bf610bd514447430d2f15',
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
        if(indexOfBooking === undefined) return;

        let bookingId = this.state.buchungen[indexOfBooking].id;
        let ticketsLoaded = this.state.tickets.findIndex((ticket) => {
            return ticket.bookingId === bookingId
        })
         
        if(ticketsLoaded !== -1) return;

        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/bookings/" + bookingId + "/ticketsBooked", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 91ba3c0f6ae8d56c4714260a8dbb7c6ce606797be4fb79eedfc73e4d6f212d255487b44e9c1b264deca11183605744c4c8c70d01b097872b41551c7a5dc8af3b7b7f755388835c67b8b094de2253e9ac95850e0575717ea5c3a9efa7239a0adaa70f6fcffec09f4b25ee4b6118fe0e9483f0d3faf8be0976a608460b0ad2156c0ddcc5f483db50404c2f6567b16a6087682d10c4ec22935be53f164a206d3f592baad81c301496b5ff5fca105e65a4121e1f0ae327d9eb5ae8f3f754fdbe7187f6a83e9e6fbe789268d8292521760e1b3f1dcb2a162b55a5b8b8089b21b996e1875f14b0b705a9cbcc806f4f3c4ac229cd3740175b0bf610bd514447430d2f15',
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
                    <Accordion onActive={(activeItems) => { this.loadTicketsHandler(activeItems[0]) }}>
                        {buchungen}
                    </Accordion>
                </Box>
            </Box>
        );
    }
}

export default BookingOverview;
