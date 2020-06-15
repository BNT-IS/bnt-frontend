import React from 'react';

import { Box, Button, Text, TextInput } from 'grommet';
import { setConstantValue } from 'typescript';

class TicketBestellung extends React.Component {

    constructor(props) {
        super(props);
        this.WindowAbsolventTicket = this.WindowAbsolventTicket.bind(this);
        this.WindowGuestTicket = this.WindowGuestTicket.bind(this);
        this.WindowParkTicket = this.WindowParkTicket.bind(this);
        this.ToOverview = this.ToOverview.bind(this);
        this.ToPayment = this.ToPayment.bind(this);
    
        this.state = { 
            guestcount: 0, 
            parkcount: 0, 
            step: 0,
        };        
    }



    WindowAbsolventTicket(){
        this.setState({ step: 0})
    }
    


    WindowGuestTicket(){
        //Wechselt die Ansicht zu den Besuchertickets
        this.setState({ step: 1 })
    }
    WindowParkTicket(){
        this.setState({ step: 2})
    }
    ToOverview(){
        this.setState({ step: 3})
    }
    ToPayment(){
        this.setState({ step: 4})
    }


    //Funktion für die Counter
    increment = (property) => {
        if (property == "guest" && this.state.guestcount < 2){
            this.setState({guestcount: this.state.guestcount + 1});
        }
        else if (property =="park" && this.state.parkcount < 3){
            this.setState({parkcount: this.state.parkcount + 1});
        }
    }
    decrement = (property) => {
        if (property == "guest" && this.state.guestcount > 0){
            this.setState({guestcount: this.state.guestcount - 1});
        }
        else if (property =="park" && this.state.parkcount > 0){
            this.setState({parkcount: this.state.parkcount - 1});
        }
    }


    render() {
        let textInputs = [];
        for (let i = 0; i < this.state.guestcount; i++){
            let elem = <TextInput key={i}  placeholder="Name des Gastes" ></TextInput>
            textInputs.push(elem)
        } 

        


        return (
            <Box className="TicketBestellung" direction="column" gap="medium" pad="medium">
               
               {this.state.step === 0 &&
                <Box gap="small">
                    Klicke hier, um ein Absolvententicket zu kaufen.
                    <Button label=" Ein Absolventen Ticket kaufen" onClick={this.WindowGuestTicket} gap="small"></Button>
                   
                </Box>
                }

                {this.state.step === 1 &&
                <Box gap="small">
                    <Text>Bitte geben sie an, wie viele Gäste Sie mitnehmen wollen.</Text>
                    <Button onClick={() => this.increment("guest")} className="guestcount" label="+"></Button>
                    <Button onClick={() => this.decrement("guest")} className="guestcount" label="-"></Button>
                    <h2>{this.state.guestcount}</h2>

                    {textInputs}
                    
                

                    <Button onClick={this.WindowAbsolventTicket} label="Zurück"></Button>
                    <Button onClick={this.WindowParkTicket} label="Weiter"></Button>
                </Box>
                }

                {this.state.step === 2 &&
                <Box gap="small">
                    <Text>Bitte geben sie an, wie viele Parktickets Sie benötigen.</Text>   

                    <Button onClick={() => this.increment("park")} className="parkcount" label="+"></Button>
                    <Button onClick={() => this.decrement("park")} className="parkcount" label="-"></Button>
                    <h2>{this.state.parkcount}</h2>
                    <Button onClick={this.WindowGuestTicket} label="Zurück"></Button>
                    <Button onClick={this.ToOverview} label="Weiter"></Button>
                </Box>
                }

                {this.state.step === 3 &&
                <Box gap="small">
                    <Text>Sie haben folgendes bestellt: <br/>
                    Absolvententicket 1 <br/> 
                    Gästeticket {this.state.guestcount} <br/>
                    Parkticket {this.state.parkcount}
                    </Text>
                    <Button onClick={this.WindowParkTicket} label="Zurück"></Button>
                    <Button onClick={this.ToPayment}  label="Zahlungspflichtig bestellen"></Button>
                </Box>
                }
                {this.state.step === 4 &&
                <Box gap="small">
                    <Text>Sie haben folgende Tickets Zahlungspflichtig bestellt.  <br/>
                    Bitte überweisen Sie folgenden Betrag auf das Konto: XXXXYYYYZZZZ.<br/>
                    Geben Sie ihren Namen als Verwendungszweck an.<br/>
                    Nach Rechnungseingang erhalten Sie Ihre Tickets an ihr Wallet gesendet.<br/>
                    </Text>   
                    <Text>Sie haben folgendes bestellt: <br/>
                    Absolvententicket 1 <br/> 
                    Gästeticket {this.state.guestcount} <br/>
                    Parkticket {this.state.parkcount}
                    </Text>
                </Box>
                }


            </Box>
        );
    }
}

export default TicketBestellung;
