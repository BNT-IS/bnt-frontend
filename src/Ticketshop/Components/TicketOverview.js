import React from 'react';
import './TicketOverview.css';
import { Box, Button, Text } from 'grommet';
import { Switch, Route, Link, useParams } from "react-router-dom";
import QRCode from 'qrcode';
import Config from '../../config';

function SingleTicketViewer(props) {
    let { identifier } = useParams();
    const ticket = props.tickets.find(ticket => ticket.identifier === identifier);
    return (
        <Box className="SingleTicket">
            {ticket.forename}
            {ticket.surname}
            {ticket.ticketType}
        </Box>
    );
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

    constructor(props) {
        super(props);
        this.state = { tickets: [], loading: false }
    }

    componentDidMount() {
        this.fetchTickets();
    }

    async fetchTickets() {
        this.setState({ loading: true });
        let address = "0x3Da85f73bC1B1662FE247391dEcD2a52f139fd13";
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v1/users/" + address + "/tickets", {
            //method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer f1df51e1835233014368105514f07a70e9f2255b279e5535810d7fbf2d565cc1d692d8b06d53f6157423bb3c63b97e5a42adfbe6277e48dc028d8043683acca13b1b9f83773015ff5f3533e9ad08943bac2eb003f24fc3e6c910d2e83e69f39ec1d3e3ac98d4d2965312670810aab8ec152338654bcab32e7c82cbe83545b0b5f307feed1976239fbe2718c97abab76768e6dcdb3e243fcead76ef2bc2ca72045f748da22dee9881a3aefe0b18ce9dd6d34eb4032ed56e1cb4d8bf11d2ff0d663b65f3ee2b2da04af8bc3b0473c4046fdc53248905d3499955f635c6ed9bb7e2defb03b54414ac617e4f73c96e6639bf1b89111458f5d830387f0c51e2c5a5d6',
            }
        }).catch(console.log);

        if (!response) return;

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

    generateQRCodes() {
        var ticketsCopy = [];
        this.state.tickets.forEach((ticket, index, array) => {
            let data = ticket.identifier; // TODO Change to signature and so on...
            QRCode.toDataURL(data).then((url) => {
                ticket.qrcode = url;
                ticketsCopy.push(ticket);
                if (index === array.length - 1) {
                    this.setState({ tickets: ticketsCopy });
                }
            }).catch(console.log);
        })
    }

    setToken(Token){
        localStorage.setItem('Tokenwert', Token);
    }
    getToken(){
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
