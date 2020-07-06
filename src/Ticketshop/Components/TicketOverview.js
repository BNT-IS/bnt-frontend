import React from 'react';
import './TicketOverview.css';
import { Box, Button, Text } from 'grommet';
import { Switch, Route, Link } from "react-router-dom";
import QRCode from 'qrcode';
import Config from '../../config';

import UserContext from '../../AppContexts/UserContext';

class SingleTicketViewer extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {};
        this.identifier = window.location.hash.replace("#/guest/tickets/", "");
        this.ticket = { forename: null, surename: null, ticketType: null };
        let tempTicket = this.props.tickets.find(ticket => ticket.identifier === this.identifier);
        if (tempTicket) {
            this.ticket = tempTicket;
        }
    }

    componentDidMount() {
        this.generateQRCode(this.ticket);
    }

    async generateQRCode(ticket) {
        // Generate code
        let data = { id: ticket.identifier, sIG: this.context.user.secretIngredient };
        QRCode.toDataURL(JSON.stringify(data)).then((url) => {
            this.setState({ qrcode: url });
        }).catch(console.log);
    }

    render() {
        return (
            <Box className="SingleTicket">
                <Box pad="small">
                    <p>{this.ticket.forename}</p>
                    <p>{this.ticket.surname}</p>
                    <p>{this.ticket.ticketType}</p>
                </Box>
                <Box pad="small">
                    <img width="300" height="300" src={this.state.qrcode} alt="Hier sollte ein QR-Code stehen"></img>
                    <Button onClick={window.print} label="Drucken"></Button>
                </Box>
            </Box>
        );
    }
}

function TicketListItem(props) {
    return (
        <Box className="TicketListItem" direction="row" gap="small" pad="small">
            <Text className="Name">{props.ticket.forename} {props.ticket.surname}</Text>
            <Text className="Type">{props.ticket.ticketType}</Text>
            <Button label="Anzeigen" onClick={() => { window.location.assign('#/guest/tickets/' + props.ticket.identifier); }}></Button>
        </Box>
    );
}

class TicketOverview extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = { tickets: [], loading: false }
    }

    componentDidMount() {
        this.fetchTickets();
    }

    async fetchTickets() {
        this.setState({ loading: true });
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/users/" + this.context.user.id + "/tickets", {
            //method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            }
        }).catch(console.log);

        if (!response.ok) {
            this.setState({ loading: false });
            alert('Beim Laden der Tickets ist ein Fehler aufgetreten.');
            return;
        }

        var tickets = await response.json().catch(console.log);

        if (!tickets) return;

        tickets.forEach((ticket) => {
            switch (ticket.ticketType) {
                case "0": ticket.ticketType = "Absolvent"; break;
                case "1": ticket.ticketType = "Begleitperson"; break;
                case "2": ticket.ticketType = "Parkticket"; break;
                default: break;
            }
        });

        this.setState({ tickets: tickets, loading: false });
    }

    setToken(Token) {
        localStorage.setItem('Tokenwert', Token);
    }
    getToken() {
        var value = localStorage.getItem('Tokenwert');
        console.log(value);
    }

    render() {
        let ticketElements = this.state.tickets.map((ticket) => <TicketListItem key={ticket.identifier} ticket={ticket}></TicketListItem>);

        return (
            <Box className="TicketOverview" direction="column" gap="medium" pad="medium">
                <Switch>
                    <Route path="/guest/tickets/:identifier">
                        <Link to="/guest/tickets/">Alle Tickets anzeigen</Link>
                        <SingleTicketViewer tickets={this.state.tickets}></SingleTicketViewer>
                    </Route>
                    <Route path="/guest/tickets/">
                        <Box>
                            <Box>
                                <h1 className="NumberOfTickets">{this.state.tickets.length}</h1>
                            </Box>
                            <Box className="TicketList">
                                {this.state.loading && <p className="loader"></p>}
                                {ticketElements}
                            </Box>
                        </Box>
                    </Route>
                </Switch>
            </Box>
        );
    }
}

export default TicketOverview;
