import React from 'react';
import { Box, Button, Text, TextInput } from 'grommet';
import Config from '../../config';

class PersonInput extends React.Component {

    constructor(props) {
        super(props);
        this.onInputHandler = this.onInputHandler.bind(this);
        this.state = { forename: "", surname: "" }
    }

    onInputHandler(event) {
        const stateCopy = this.state;
        stateCopy[event.target.name] = event.target.value;
        this.setState(stateCopy);
        this.props.onInput(this.state)
    }

    render() {
        return (
            <Box>
                <TextInput name="forename" placeholder="Vorname des Gastes" value={this.state.forename} onChange={this.onInputHandler}></TextInput>
                <TextInput name="surname" placeholder="Nachname des Gastes" value={this.state.surname} onChange={this.onInputHandler}></TextInput>
            </Box>
        );
    }

}

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
            persons: [],
            personInputFields: []
        };
    }

    // @Nils Für das generieren des Identifiers für das Ticket einfach erstmal eine Zufallszahl nehmen!
    // Aber bitte eine extra Funktion für generieren des Ticket-Identifiers anlegen, dann können wir später gemeinsam den "echten/sicheren" Identifier-Generator programmieren


    //Wechsel der Ansichtenfenster
    WindowAbsolventTicket() {
        this.setState({ step: 0 })
    }
    WindowGuestTicket() {
        this.setState({ step: 1 })
    }
    WindowParkTicket() {
        this.setState({ step: 2 })
    }
    ToOverview() {
        this.setState({ step: 3 })
    }
    ToPayment() {
        this.setState({ step: 4 })
    }


    //Funktion für die Counter
    increment = (property) => {
        if (property === "guest" && this.state.guestcount < 2) {

            let personsIndex = this.state.persons.length;
            let personInput = <PersonInput onInput={(personName) => { let personsList = this.state.persons; personsList[personsIndex] = personName; this.setState({ persons: personsList }) }}></PersonInput>
            let personsList = this.state.persons;
            personsList[personsIndex] = {};

            this.state.personInputFields.push(personInput);
            this.setState({ persons: personsList, personInputFields: this.state.personInputFields, guestcount: this.state.guestcount + 1 });
            

        }
        else if (property === "park" && this.state.parkcount < 3) {
            this.setState({ parkcount: this.state.parkcount + 1 });
        }
    }
    decrement = (property) => {
        if (property === "guest" && this.state.guestcount > 0) {
            this.setState({ guestcount: this.state.guestcount - 1 });
        }
        else if (property === "park" && this.state.parkcount > 0) {
            this.setState({ parkcount: this.state.parkcount - 1 });
        }
    }


    /*async fetchTickets() {
        this.setState({ loading: true });
        let address = "0x3Da85f73bC1B1662FE247391dEcD2a52f139fd13";
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v1/users/" + address + "/tickets", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
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
    }*/


   



    render() {
        console.log(this.state.persons)

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
                        <Text>Bitte geben sie an, wie viele Begleitpersonen Sie mitnehmen wollen.</Text>
                        <Button onClick={() => this.increment("guest")} className="guestcount" label="+"></Button>
                        <Button onClick={() => this.decrement("guest")} className="guestcount" label="-"></Button>
                        <h2>{this.state.guestcount}</h2>

                        {this.state.personInputFields}


                        <Button onClick={this.WindowAbsolventTicket} label="Zurück"></Button>
                        <Button onClick={this.WindowParkTicket} label="Weiter"></Button>
                    </Box>
                }

                {this.state.step === 2 &&
                    <Box gap="small">
                        <Text>Bitte geben sie an, wie viele Parktickets Sie benötigen.</Text>
                        <Button onClick={() => this.increment("park")} className="parkcount" label="+"></Button>
                        <Button onClick={() => this.decrement("park")} className="parkcount" label="-"></Button>
                        <h2>Anzahl der Parktickets: {this.state.parkcount}</h2>
                        <Button onClick={this.WindowGuestTicket} label="Zurück"></Button>
                        <Button onClick={this.ToOverview} label="Weiter"></Button>
                    </Box>
                }

                {this.state.step === 3 &&
                    <Box gap="small">
                        <Text>Sie haben folgende Tickets bestellt: <br />
                    Absolventent: 1 <br />
                    Begleitpersonen: {this.state.guestcount} <br />
                    Parkticket {this.state.parkcount}
                        </Text>
                        <Button onClick={this.WindowParkTicket} label="Zurück"></Button>
                        <Button onClick={this.ToPayment} label="Zahlungspflichtig bestellen"></Button>
                    </Box>
                }
                {this.state.step === 4 &&
                    <Box gap="small">
                        <Text>Sie haben folgende Tickets Zahlungspflichtig bestellt.  <br />
                    Bitte überweisen Sie folgenden Betrag auf das Konto: XXXXYYYYZZZZ.<br />
                    Geben Sie ihren Namen als Verwendungszweck an.<br />
                    Nach Rechnungseingang erhalten Sie Ihre Tickets an ihr Wallet gesendet.<br />
                        </Text>
                        <Text>Sie haben folgende Tickets bestellt: <br />
                    Absolventent: 1 <br />
                    Begleitpersonen: {this.state.guestcount} <br />
                    Parkticket {this.state.parkcount}
                        </Text>
                    </Box>
                }


            </Box>
        );
    }
}

export default TicketBestellung;
