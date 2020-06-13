import React from 'react';
import './TicketOverview.css';
import { Box, Text, Accordion, AccordionPanel } from 'grommet';

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
                    <span>Vorname: {ticket.forename}/</span>
                    <span>Ticket Typ: {ticket.ticketType}</span>
                </Box>
            )
        });
        var buchung = this.props.booking;
        var accPanelLabel = "Buchungs-ID: " + buchung.id + " Account: " + buchung.user + " Buchungsdatum: " + buchung.dateBooked + " Bezahldatum: " + buchung.datePaid;
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
        var response = await fetch("http://localhost:3000/api/v1/users/0x1/bookings", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 43059960ead1db519cbbed4aa934462808262fa6204daefabcab4b0b38b667d61828556556e4b9e80b6a91e9990fc8704bbf399cdafd41b06ddc0c31a500accb94b96fa096bf8789c7c582f9e5df0ead8f23ef77a9b045ccbb78a60cd2401592e79b8c396cd4520297cfb0603011a7f373f9dbbc6a37527bd160b5e754850cbf8779a4c5049e816a9b9bee268e110baf53e901e80aa8df89d6a07b92cf33b581294bedc1b8da2c9a583845b13766f4c89abc9ac3466b69748a1ba0bf6a80a8c2b6aa6ec084c88c2cc4d212470089dbb9e4bce056c90e8a0ebaa5b9e563c80d20ac173b791769eac9d29c509810086f1700c7cec0071a03bb7aed67fec7215979',
            }
        }).catch(console.log)
        if (!response) return
        console.log(response)
        var data = await response.json().catch(console.log)
        if (!data) return;
        this.setState({ buchungen: data, loading: false })
    }

    async loadTicketsHandler(indexOfBooking) {
        if(indexOfBooking === undefined) return;

        let bookingId = this.state.buchungen[indexOfBooking].id;
        let ticketsLoaded = this.state.tickets.findIndex((ticket) => {
            return ticket.booking === bookingId
        })
         
        if(ticketsLoaded !== -1) return;

        var response = await fetch("http://localhost:3000/api/v1/bookings/" + bookingId + "/ticketsBooked", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 43059960ead1db519cbbed4aa934462808262fa6204daefabcab4b0b38b667d61828556556e4b9e80b6a91e9990fc8704bbf399cdafd41b06ddc0c31a500accb94b96fa096bf8789c7c582f9e5df0ead8f23ef77a9b045ccbb78a60cd2401592e79b8c396cd4520297cfb0603011a7f373f9dbbc6a37527bd160b5e754850cbf8779a4c5049e816a9b9bee268e110baf53e901e80aa8df89d6a07b92cf33b581294bedc1b8da2c9a583845b13766f4c89abc9ac3466b69748a1ba0bf6a80a8c2b6aa6ec084c88c2cc4d212470089dbb9e4bce056c90e8a0ebaa5b9e563c80d20ac173b791769eac9d29c509810086f1700c7cec0071a03bb7aed67fec7215979',
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
                return ticket.booking === buchung.id
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
