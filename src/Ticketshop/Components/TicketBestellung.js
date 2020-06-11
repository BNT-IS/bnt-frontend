import React from 'react';

import { Box, Button, Text } from 'grommet';

class TicketBestellung extends React.Component {

    constructor(props) {
        super(props);
        this.AbsolventenTicketAdd = this.AbsolventenTicketAdd.bind(this);
        this.GuestTicketAdd = this.GuestTicketAdd.bind(this);
        this.ToPayment = this.ToPayment.bind(this);
       // this.checkZero = this.checkZero.bind(this);

        this.state = { 
            guestcount: 0, 
            parkcount: 0, 
            step: 0 
        };
        
    }


    AbsolventenTicketAdd(){
        //Wechselt die Ansicht zu den GästeTickets
        this.setState({ step: 1 })
    }
    GuestTicketAdd(){
        this.setState({ step: 2})
    }
    ToPayment(){
        this.setState({ step: 3})
    }

/*Prüfen ob Gästeanzahl unter 0 liegt
    checkZero = () => {
        const guestcount = this.props.guestcount;
        if(guestcount < 0){
            console.log(false);
        }
    }
*/

    //Funktion für die GästeTicketCounter
    increment = () => {
        this.setState({guestcount: this.state.guestcount + 1});
    }
    decrement = () => {
        this.setState({guestcount: this.state.guestcount - 1});
    }

    //Funktion für die ParkticketCounter
    addition = () => {
        this.setState({parkcount: this.state.parkcount + 1});
    }
    subtract = () => {
        this.setState({parkcount: this.state.parkcount - 1});
    }


    render() {
        return (
            <Box className="TicketBestellung" direction="column" gap="medium" pad="medium">
               
               {this.state.step === 0 &&
                <Box gap="small">
                    Klicke hier, um ein Absolvententicket zu kaufen.
                    <Button label=" Ein Absolventen Ticket kaufen" onClick={this.AbsolventenTicketAdd} gap="small"></Button>
                   
                </Box>
                }

                {this.state.step === 1 &&
                <Box gap="small">
                    <Text>Bitte geben sie an, wie viele Gäste Sie mitnehmen wollen.</Text>
                    <Button onClick={this.increment} className="guestcount" label="+"></Button>
                    <Button onClick={this.decrement} className="guestcount" label="-"></Button>
                    <h2>{this.state.guestcount}</h2>

                   <Button onClick={this.GuestTicketAdd} label="Weiter"></Button>
                </Box>
                }

                {this.state.step === 2 &&
                <Box gap="small">
                    Bitte geben sie an, wie viele Parktickets Sie benötigen.

                    <Button onClick={this.addition} className="parkcount" label="+"></Button>
                    <Button onClick={this.subtract} className="parkcount" label="-"></Button>
                    <h2>{this.state.parkcount}</h2>
                    <Button onClick={this.ToPayment} label="Zur Bezahlung"></Button>
                </Box>
                }

                {this.state.step === 3 &&
                <Box gap="small">
                    <Text>Sie haben folgendes bestellt: </Text> Absolvententicket 1 Gästeticket 2 Parkticket 0
                    <Text>Bitte überweisen Sie folgenden Betrag auf das Konto: XXXXYYYYZZZZ.<br/>
                    Geben Sie ihren Namen als Verwendungszweck an.<br/>
                    Nach Rechnungseingang erhalten Sie Ihre Tickets an ihr Wallet gesendet.<br/>
                    </Text>

                </Box>
                }




            </Box>
        );
    }
}

export default TicketBestellung;
