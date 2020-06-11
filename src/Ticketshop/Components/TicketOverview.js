import React from 'react';
import './TicketOverview.css';
import { Box, Button, Text } from 'grommet';
import { Switch, Route, Link, useParams } from "react-router-dom";
import QRCode from 'qrcode';

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
        var response = await fetch("http://localhost:3000/api/v1/users/" + address + "/tickets", {
            //method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 43059960ead1db519cbbed4aa934462808262fa6204daefabcab4b0b38b667d61828556556e4b9e80b6a91e9990fc8704bbf399cdafd41b06ddc0c31a500accb94b96fa096bf8789c7c582f9e5df0ead8f23ef77a9b045ccbb78a60cd2401592e79b8c396cd4520297cfb0603011a7f373f9dbbc6a37527bd160b5e754850cbf8779a4c5049e816a9b9bee268e110baf53e901e80aa8df89d6a07b92cf33b581294bedc1b8da2c9a583845b13766f4c89abc9ac3466b69748a1ba0bf6a80a8c2b6aa6ec084c88c2cc4d212470089dbb9e4bce056c90e8a0ebaa5b9e563c80d20ac173b791769eac9d29c509810086f1700c7cec0071a03bb7aed67fec7215979',
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
