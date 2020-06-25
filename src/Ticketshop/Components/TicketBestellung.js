import React from 'react';
import { Box, Button, Text, TextInput, CheckBox } from 'grommet';
import Config from '../../config';
import { ThemeProvider } from 'styled-components';
import { setConstantValue } from 'typescript';

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

    constructor(props) {
        super(props);
        this.WindowAbsolventTicket = this.WindowAbsolventTicket.bind(this);
        this.WindowGuestTicket = this.WindowGuestTicket.bind(this);
        this.WindowParkTicket = this.WindowParkTicket.bind(this);
        this.ToOverview = this.ToOverview.bind(this);
        this.ToOrder = this.ToOrder.bind(this);
        this.ToPayment = this.ToPayment.bind(this);
        this.createTickets = this.createTickets.bind(this);
        this.createBooking = this.createBooking.bind(this);
        this.onInputHandler = this.onInputHandler.bind(this);



        this.state = {
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
    ToOrder() {
        this.setState({ step: 5 })
    }


    //Funktion für die Counter und der Namen der Gäste
    increment = (property) => {
        if (property === "guest" && this.state.guestcount < 2) {

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


    async createBooking() {
        let userId = "1";
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/bookings", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 91ba3c0f6ae8d56c4714260a8dbb7c6ce606797be4fb79eedfc73e4d6f212d255487b44e9c1b264deca11183605744c4c8c70d01b097872b41551c7a5dc8af3b7b7f755388835c67b8b094de2253e9ac95850e0575717ea5c3a9efa7239a0adaa70f6fcffec09f4b25ee4b6118fe0e9483f0d3faf8be0976a608460b0ad2156c0ddcc5f483db50404c2f6567b16a6087682d10c4ec22935be53f164a206d3f592baad81c301496b5ff5fca105e65a4121e1f0ae327d9eb5ae8f3f754fdbe7187f6a83e9e6fbe789268d8292521760e1b3f1dcb2a162b55a5b8b8089b21b996e1875f14b0b705a9cbcc806f4f3c4ac229cd3740175b0bf610bd514447430d2f15',
            },
            body: JSON.stringify({ userId: userId })
        }).catch(console.log);
        // Error Handling für Benutzer
        if (!response) {
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

    generateIdentifier() {
        return Math.random() * 100000;
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
                    'Authorization': 'Bearer 91ba3c0f6ae8d56c4714260a8dbb7c6ce606797be4fb79eedfc73e4d6f212d255487b44e9c1b264deca11183605744c4c8c70d01b097872b41551c7a5dc8af3b7b7f755388835c67b8b094de2253e9ac95850e0575717ea5c3a9efa7239a0adaa70f6fcffec09f4b25ee4b6118fe0e9483f0d3faf8be0976a608460b0ad2156c0ddcc5f483db50404c2f6567b16a6087682d10c4ec22935be53f164a206d3f592baad81c301496b5ff5fca105e65a4121e1f0ae327d9eb5ae8f3f754fdbe7187f6a83e9e6fbe789268d8292521760e1b3f1dcb2a162b55a5b8b8089b21b996e1875f14b0b705a9cbcc806f4f3c4ac229cd3740175b0bf610bd514447430d2f15',
                },
                body: JSON.stringify({
                    identifier: this.generateIdentifier(),
                    bookingId: bookingResult,
                    ticketType: 1,
                    forename: element.forename,
                    surname: element.surname,
                    isWheelchairUser: element.isWheelchairUser,
                })
            }).catch(console.log);
            // Error Handling für Benutzer
            if (!response) {
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
                'Authorization': 'Bearer 91ba3c0f6ae8d56c4714260a8dbb7c6ce606797be4fb79eedfc73e4d6f212d255487b44e9c1b264deca11183605744c4c8c70d01b097872b41551c7a5dc8af3b7b7f755388835c67b8b094de2253e9ac95850e0575717ea5c3a9efa7239a0adaa70f6fcffec09f4b25ee4b6118fe0e9483f0d3faf8be0976a608460b0ad2156c0ddcc5f483db50404c2f6567b16a6087682d10c4ec22935be53f164a206d3f592baad81c301496b5ff5fca105e65a4121e1f0ae327d9eb5ae8f3f754fdbe7187f6a83e9e6fbe789268d8292521760e1b3f1dcb2a162b55a5b8b8089b21b996e1875f14b0b705a9cbcc806f4f3c4ac229cd3740175b0bf610bd514447430d2f15',
            },
            body: JSON.stringify({
                identifier: this.generateIdentifier(),
                bookingId: bookingResult,
                ticketType: 0,
                forename: this.state.graduate.forename,
                surname: this.state.graduate.surname,
                isWheelchairUser: false,
            })
        }).catch(console.log);
        // Error Handling für Benutzer
        if (!response) {
            this.setState({ step: 100 });
            return;
         }

        result = await response.json().catch(console.log);

        if (!result) {
            this.setState({ step: 100 });
            return;
        }
        console.log(result)
        this.ToOrder();

        //Parkticket in DB schreiben
        for (let element of this.state.parkcount) {
            console.log(element);
            var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/ticketsBooked", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 91ba3c0f6ae8d56c4714260a8dbb7c6ce606797be4fb79eedfc73e4d6f212d255487b44e9c1b264deca11183605744c4c8c70d01b097872b41551c7a5dc8af3b7b7f755388835c67b8b094de2253e9ac95850e0575717ea5c3a9efa7239a0adaa70f6fcffec09f4b25ee4b6118fe0e9483f0d3faf8be0976a608460b0ad2156c0ddcc5f483db50404c2f6567b16a6087682d10c4ec22935be53f164a206d3f592baad81c301496b5ff5fca105e65a4121e1f0ae327d9eb5ae8f3f754fdbe7187f6a83e9e6fbe789268d8292521760e1b3f1dcb2a162b55a5b8b8089b21b996e1875f14b0b705a9cbcc806f4f3c4ac229cd3740175b0bf610bd514447430d2f15',
                },
                body: JSON.stringify({
                    identifier: this.generateIdentifier(),
                    bookingId: bookingResult,
                    ticketType: 2,
                    forename: element.forename,
                    surname: element.surname,
                    isWheelchairUser: element.isWheelchairUser,
                })
            }).catch(console.log);
            // Error Handling für Benutzer
            if (!response) {
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
                        <Button label="Buchung erstellen" onClick={this.createBooking}></Button>
                    </Box>
                }
                {this.state.step === 5 &&
                    <Box gap="small">
                        Erfolgreich bestellt!
                    </Box>
                }

                {this.state.step === 100 &&
                    <Box gap="small">
                        <Text>Ein Fehler im Bestellvorgang ist aufgetreten!</Text>
                    </Box>
                }


            </Box>
        );
    }
}

export default TicketBestellung;
