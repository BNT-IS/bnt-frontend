import React from 'react';
import { Box, Button, Text, TextInput, CheckBox } from 'grommet';
import Config from '../../config';

import UserContext from '../../AppContexts/UserContext';

class PersonInput extends React.Component {

    constructor(props) {
        super(props);
        this.onInputHandler = this.onInputHandler.bind(this);
        this.onCheckBox = this.onCheckBox.bind(this)
        this.state = {
            forename: "",
            surname: "",
            isWheelchairUser: false,
        }
    }

    onInputHandler(event) {
        const stateCopy = this.state;
        stateCopy[event.target.name] = event.target.value;
        this.setState(stateCopy);
        this.props.onInput(this.state)
    }

    onCheckBox(event) {
        const stateCopy = this.state;
        stateCopy[event.target.name] = !stateCopy[event.target.name];
        this.setState(stateCopy);
        this.props.onInput(this.state)
    }

    render() {
        return (
            <Box>
                <TextInput name="forename" placeholder="Vorname des Gastes" value={this.state.forename} onChange={this.onInputHandler}></TextInput>
                <TextInput name="surname" placeholder="Nachname des Gastes" value={this.state.surname} onChange={this.onInputHandler}></TextInput>
                <CheckBox name="isWheelchairUser" label="Rollstuhlfahrer bitte ankreuzen" onChange={this.onCheckBox} checked={this.state.isWheelchairUser} />
            </Box>
        );
    }

}

class TicketBestellung extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.windowAbsolventTicket = this.windowAbsolventTicket.bind(this);
        this.windowGuestTicket = this.windowGuestTicket.bind(this);
        this.windowParkTicket = this.windowParkTicket.bind(this);
        this.toOverview = this.toOverview.bind(this);
        this.toPayment = this.toPayment.bind(this);
        this.createTickets = this.createTickets.bind(this);
        this.createBooking = this.createBooking.bind(this);
        this.onInputHandler = this.onInputHandler.bind(this);
        this.ShopConfig = this.ShopConfig.bind(this);


        this.state = {
            MaxAnzahlAbsolvententickets: 0,
            MaxAnzahBesuchertickets: 0,
            guestcount: 0,
            parkcount: 0,
            step: 0,
            persons: [],
            personInputFields: [],
            graduate: {
                forename: "",
                surname: "",
                isWheelchairUser: false
            },
            bookingResult: null
        };


    }

    // @Nils Für das generieren des Identifiers für das Ticket einfach erstmal eine Zufallszahl nehmen!
    // Aber bitte eine extra Funktion für generieren des Ticket-Identifiers anlegen, dann können wir später gemeinsam den "echten/sicheren" Identifier-Generator programmieren

    onInputHandler(event, type) {
        if (type === "forename") {
            this.setState({
                graduate: {
                    forename: event.target.value,
                    surname: this.state.graduate.surname
                }
            })
        } else {
            this.setState({
                graduate: {
                    surname: event.target.value,
                    forename: this.state.graduate.forename
                }
            })
        }


    }

    componentDidMount(){
        this.ShopConfig();
    }
    //Wechsel der Ansichtenfenster
    windowAbsolventTicket() {
        this.setState({ step: 0 })
    }
    windowGuestTicket() {
        this.setState({ step: 1 })
    }
    windowParkTicket() {
        this.setState({ step: 2 })
    }
    toOverview() {
        this.setState({ step: 3 })
    }
    toPayment() {
        this.createBooking();
        this.setState({ step: 4 })
    }


    //Funktion für die Counter und der Namen der Gäste
    increment = (property) => {
        if (property === "guest" && this.state.guestcount < this.state.MaxAnzahBesuchertickets) {

            let personsIndex = this.state.persons.length;
            let personInput = <PersonInput key={personsIndex} onInput={(personName) => { let personsList = this.state.persons; personsList[personsIndex] = personName; this.setState({ persons: personsList }) }}></PersonInput>
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

            this.state.personInputFields.pop();
            this.state.persons.pop();

            this.setState({ guestcount: this.state.guestcount - 1, personInputFields: this.state.personInputFields, persons: this.state.persons });
        }
        else if (property === "park" && this.state.parkcount > 0) {
            this.setState({ parkcount: this.state.parkcount - 1 });
        }
    }

    //Abfragen Backend
    async ShopConfig() {
        const response = await fetch(Config.BACKEND_BASE_URI + '/api/v2/shopConfig', {
            method: 'GET',
            mose: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
        }).catch(console.log);
        if (!response.ok){
            alert (response.message);
            //Error Handling
        }
        if (response.ok){
            console.log(response);
            var configData = await response.json();
            console.log(configData);
            this.state.MaxAnzahlAbsolvententickets = configData.max_TicketType_0_pro_Absolvent;
            this.state.MaxAnzahBesuchertickets = configData.max_TicketType_1_pro_Absolvent;
            console.log(this.state.MaxAnzahlAbsolvententickets);
            console.log(this.state.MaxAnzahBesuchertickets);
            
        }
    }



    //Buchung erstellen
    async createBooking() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/bookings", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            },
            body: JSON.stringify({ userId: this.context.user.id })
        }).catch(console.log);
        // Error Handling für Benutzer
        if (!response.ok) {
            this.setState({ step: 100 });
            return;
        }


        var result = await response.json().catch(console.log);
        console.log(result)
        this.setState({ bookingResult: result });

        if (!result) {
            this.setState({ step: 100 });
            return;
        }
        console.log(result);

        await this.createTickets();
    }

    async createTickets() {
        console.log(this.state)
        let bookingResult = this.state.bookingResult.id;
        for (let element of this.state.persons) {
            console.log(element);
            var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/ticketsBooked", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.context.token
                },
                body: JSON.stringify({
                    bookingId: bookingResult,
                    ticketType: 1,
                    forename: element.forename,
                    surname: element.surname,
                    isWheelchairUser: element.isWheelchairUser,
                })
            }).catch(console.log);

            // Error Handling für Benutzer
            if (!response.ok) {
                this.setState({ step: 100 });
                return;
            }
            var result = await response.json().catch(console.log);
            if (!result) {
                this.setState({ step: 100 });
                return;
            }
            console.log(result)
        }

        //Ticket für Absolvent in DB schreiben
        response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/ticketsBooked", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            },
            body: JSON.stringify({
                bookingId: bookingResult,
                ticketType: 0,
                forename: this.state.graduate.forename,
                surname: this.state.graduate.surname,
                isWheelchairUser: false,
            })
        }).catch(console.log);

        // Error Handling für Benutzer
        if (!response.ok) {
            this.setState({ step: 100 });
            return;
        }

        result = await response.json().catch(console.log);

        if (!result) {
            this.setState({ step: 100 });
            return;
        }
        console.log(result);

        //Parkticket in DB schreiben
        let anzahlparktick = this.state.parkcount;
        for (var i = 0; i < anzahlparktick; i++) {
            // console.log(element);
            response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/ticketsBooked", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.context.token
                },
                body: JSON.stringify({
                    bookingId: bookingResult,
                    ticketType: 2,
                    forename: this.state.graduate.forename + " " + i,
                    surname: this.state.graduate.surname,
                    isWheelchairUser: false,
                })
            }).catch(console.log);

            // Error Handling für Benutzer
            if (!response.ok) {
                this.setState({ step: 100 });
                return;
            }
            result = await response.json().catch(console.log);
            if (!result) {
                this.setState({ step: 100 });
                return;
            }
            console.log(result)
        }

    }


    render() {
        console.log(this.state.persons)
        return (
            <Box className="TicketBestellung" direction="column" gap="medium" pad="medium">

                {this.state.step === 0 &&
                    <Box gap="small">
                        <Text>Bitte tragen Sie ihren Namen in die Felder ein und bestätigen Sie die Eingabe mit dem Button!</Text>
                        <TextInput name="forename" placeholder="Vorname des Absolventen" value={this.state.graduate.forename} onChange={(event) => this.onInputHandler(event, "forename")}></TextInput>
                        <TextInput name="surname" placeholder="Nachname des Absolventen" value={this.state.graduate.surname} onChange={(event) => this.onInputHandler(event, "surname")}></TextInput>
                        <CheckBox name="isWheelchairUser" label="Rollstuhlfahrer bitte ankreuzen" value={this.state.graduate.isWheelchairUser} onChange={this.onCheckBox} checked={this.state.isWheelchairUser} />
                        <Button label=" Ein Absolventen Ticket kaufen" onClick={this.windowGuestTicket} gap="small"></Button>
                    </Box>
                }

                {this.state.step === 1 &&
                    <Box gap="small">
                        <Text>Bitte geben sie an, wie viele Begleitpersonen Sie mitnehmen wollen.</Text>
                        <Button onClick={() => this.increment("guest")} className="guestcount" label="+"></Button>
                        <Button onClick={() => this.decrement("guest")} className="guestcount" label="-"></Button>
                        <h2>Anzahl der Begleitpersonen: {this.state.guestcount}</h2>
                        {this.state.personInputFields}
                        <Button onClick={this.windowAbsolventTicket} label="Zurück"></Button>
                        <Button onClick={this.windowParkTicket} label="Weiter"></Button>
                    </Box>
                }

                {this.state.step === 2 &&
                    <Box gap="small">
                        <Text>Bitte geben sie an, wie viele Parktickets Sie benötigen.</Text>
                        <Button onClick={() => this.increment("park")} className="parkcount" label="+"></Button>
                        <Button onClick={() => this.decrement("park")} className="parkcount" label="-"></Button>
                        <h2>Anzahl der Parktickets: {this.state.parkcount}</h2>
                        <Button onClick={this.windowGuestTicket} label="Zurück"></Button>
                        <Button onClick={this.toOverview} label="Weiter"></Button>
                    </Box>
                }

                {this.state.step === 3 &&
                    <Box gap="small">
                        <Text>Sie haben folgende Tickets bestellt: <br />
                    Absolventent: 1 <br />
                    Begleitpersonen: {this.state.guestcount} <br />
                    Parkticket {this.state.parkcount}
                        </Text>
                        <Button onClick={this.windowParkTicket} label="Zurück"></Button>
                        <Button onClick={this.toPayment} label="Zahlungspflichtig bestellen"></Button>
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
                    Parkticket: {this.state.parkcount}
                        </Text>
                    </Box>
                }

                {this.state.step === 100 &&
                    <Box gap="small">
                        <Text>Es ist ein Fehler beim Bestellvorgang aufgetreten. Bitte versuche Sie es erneut.</Text>
                    </Box>
                }

            </Box>
        );
    }
}

export default TicketBestellung;
