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
        this.state = {
            tickets: [
                { identifier: "ABC", ticketType: "Absolvent", forename: "Fabian", surname: "Busch" },
                { identifier: "DEF", ticketType: "Absolvent", forename: "Robin", surname: "Fuchs" },
                { identifier: "GHI", ticketType: "Absolvent", forename: "Nils", surname: "Niemann" },
                { identifier: "JKL", ticketType: "Absolvent", forename: "Alexander", surname: "Beuerle" }
            ]
        }
    }

    componentDidMount() {
        this.generateQRCodes();
    }

    generateQRCodes() {
        var ticketsCopy = [];
        this.state.tickets.forEach((ticket, index, array) => {
            let data = ticket.identifier; // TODO Change to signature and so on...
            QRCode.toDataURL(data).then((url) => {
                ticket.qrcode = url;
                ticketsCopy.push(ticket);
                if(index === array.length-1){
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
