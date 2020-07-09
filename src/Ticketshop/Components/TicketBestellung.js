import React from 'react';
import { Box, Button, Text, TextInput, CheckBox, Heading } from 'grommet';
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
        this.getPaymentOptions = this.getPaymentOptions.bind(this);
        this.paymentCalculation = this.paymentCalculation.bind(this);


        this.state = {
            MaxAnzahlAbsolvententickets: 0,
            MaxAnzahBesuchertickets: 0,
            TicketPrice_Type0: 0,
            TicketPrice_Type1: 0,
            TicketPrice_Type2: 0,
            PaymentBankActive: false,
            PaymentBankReceiver: "",
            PaymentBankName: "",
            PaymentBankIban: "",
            PaymentPayPalActive: false,
            PaymentPayPalLink: "",
            PaymentPayPalMail: "",
            TotalInvoice: 0,
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

    componentDidMount() {
        this.ShopConfig();
        this.getPaymentOptions();
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
        this.setState({ step: 3 });
        this.paymentCalculation();
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
        else if (property === "park" && this.state.parkcount < 1 + this.state.guestcount) {
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



    //Soll die zur Verfügung stehenden Zahlungsoptionen bereitstellen. Diese werden im BAckend aus der Config "paymentOptions" geholt
    showPaymentOptions (PaymentBankActive){
        if (PaymentBankActive === true){
                this.state.PaymentBankName.print();
                this.state.PaymentBankReceiver.print();
                this.state.PaymentBankIban.print();
        }
    }

    paymentCalculation (){
        var gesamtBetrag = this.state.TicketPrice_Type0 + (this.state.guestcount * this.state.TicketPrice_Type1) + (this.state.parkcount * this.state.TicketPrice_Type2);
        this.setState({ TotalInvoice: gesamtBetrag });
     
    }

    //Abfragen Backend
    async ShopConfig() {
        var response = await fetch(Config.BACKEND_BASE_URI + '/api/v2/shopConfig', {
            method: 'GET',
            mose: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
        }).catch(console.log)
        if (!response.ok) {
            alert(response.message);
        }
        if (response.ok) {
            var configData = await response.json();
            this.setState({MaxAnzahlAbsolvententickets: configData.max_TicketType_0_pro_Absolvent});
            this.setState({MaxAnzahBesuchertickets: configData.max_TicketType_1_pro_Absolvent});
            this.setState({TicketPrice_Type0: parseInt(configData.price_TicketType_0)});
            this.setState({TicketPrice_Type1: parseInt(configData.price_TicketType_1)});
            this.setState({TicketPrice_Type2: parseInt(configData.price_TicketType_2)});
            if (!configData.salesStatus) {
                alert("Der Ticketverkauf ist derzeit nicht aktiv!");
                this.context.redirectUserToHome();
            }
        }
    }

    async getPaymentOptions() {
        //Liest die Werte der Zahlungsverbindungen aus
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/paymentOptions", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
        }).catch(console.log)

        if (response) {
            var configData = await response.json().catch(console.log);
            this.setState({PaymentBankActive: configData.Bank.Aktiviert});
            this.setState({PaymentBankReceiver: configData.Bank.Empfänger});
            this.setState({PaymentBankName: configData.Bank.Name_der_Bank});
            this.setState({PaymentBankIban: configData.Bank.IBAN});
            this.setState({PaymentPayPalActive: configData.PayPal.Aktiviert});
            this.setState({PaymentPayPalLink: configData.PayPal.PayPal_Link});
            this.setState({PaymentPayPalMail: configData.PayPal.PayPal_Verwendung})
            return;
        }    
        //Error Handling noch machen
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
        this.setState({ bookingResult: result });

        if (!result) {
            this.setState({ step: 100 });
            return;
        }

        await this.createTickets();
    }

    async createTickets() {
        let bookingResult = this.state.bookingResult.id;
        for (let element of this.state.persons) {
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

        //Parkticket in DB schreiben
        let anzahlparktick = this.state.parkcount;
        for (var i = 0; i < anzahlparktick; i++) {
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
        }

    }


    render() {
        return (
            <Box className="TicketBestellung" direction="column" gap="medium" pad="medium">

                {this.state.step === 0 &&
                    <Box gap="small">
                        <Heading>Angaben zu Ihnen</Heading>
                        <Text>Bitte tragen Sie Ihren vollständigen Namen ein.</Text>
                        <Text>Ticketpreis in EURO: {this.state.TicketPrice_Type0} €</Text>
                        <TextInput name="forename" placeholder="Vorname des Absolventen" value={this.state.graduate.forename} onChange={(event) => this.onInputHandler(event, "forename")}></TextInput>
                        <TextInput name="surname" placeholder="Nachname des Absolventen" value={this.state.graduate.surname} onChange={(event) => this.onInputHandler(event, "surname")}></TextInput>
                        <CheckBox name="isWheelchairUser" label="Rollstuhlfahrer bitte ankreuzen" value={this.state.graduate.isWheelchairUser} onChange={this.onCheckBox} checked={this.state.isWheelchairUser} />
                        <Button label="Weiter" onClick={this.windowGuestTicket} gap="small"></Button>
                    </Box>
                }

                {this.state.step === 1 &&
                    <Box gap="small">
                        <Heading>Angaben zu Begleitpersonen</Heading>
                        <Text>Bitte geben Sie an, wie viele Begleitpersonen Sie mitnehmen wollen.</Text>
                        <Text>Ticketpreis in EURO: {this.state.TicketPrice_Type1} €</Text>
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
                        <Heading>Parktickets</Heading>
                        <Text>Bitte geben Sie an, wie viele Parktickets Sie benötigen.</Text>
                        <Text>Ticketpreis in EURO: {this.state.TicketPrice_Type2} €</Text>
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
                            Absolvent: 1 x  {this.state.TicketPrice_Type0} €<br />
                            Begleitpersonen: {this.state.guestcount} x {this.state.TicketPrice_Type1} €<br />
                            Parkticket: {this.state.parkcount} x {this.state.TicketPrice_Type2} €
                        </Text>
                        <Text>Summe: {this.state.TotalInvoice}</Text>
                        <Button onClick={this.windowParkTicket} label="Zurück"></Button>
                        <Button onClick={this.toPayment} label="Zahlungspflichtig bestellen"></Button>
                    </Box>
                }
                {this.state.step === 4 &&
                    <Box gap="small">
                        <Text>Die Buchung wurde erfolgreich übermittelt.<br />
                            Bitte überweisen Sie folgenden Betrag auf das Konto: XXXXYYYYZZZZ.<br />
                            {this.showPaymentOptions}
                            Geben Sie ihren Namen als Verwendungszweck an.<br />
                            Nach Rechnungseingang können Sie Ihre Tickets unter "Tickets Anzeigen" einsehen.<br />
                        </Text>
                        <Text>Sie haben folgende Tickets bestellt: <br />
                            Absolvent: 1 <br />
                            Begleitpersonen: {this.state.guestcount} <br />
                            Parkticket: {this.state.parkcount}
                        </Text>
                    </Box>
                }

                {this.state.step === 100 &&
                    <Box gap="small">
                        <Text>Es ist ein Fehler beim Bestellvorgang aufgetreten. Bitte versuche Sie es später erneut.</Text>
                    </Box>
                }

            </Box>
        );
    }
}

export default TicketBestellung;
