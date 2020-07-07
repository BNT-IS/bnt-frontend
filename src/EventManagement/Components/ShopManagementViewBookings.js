import React from 'react';
import { Box, Button, Text, List, TextInput } from 'grommet';
import Config from '../../config';
import './ShopManagement.css';
import './ShopManagement.js';
import UserContext from '../../AppContexts/UserContext'


class ShopManagementViewBookings extends React.Component {

    static contextType = UserContext;


    constructor(props) {
        super(props);
        this.state = {
            open: [], paid: [], searchOpen: "", searchPaid: "",
            headline1: [{ id: "ID der Buchung", email: "E-Mail-Adresse des Absolventen", createdAt: "Erstellungsdatum", approve: "Buchung freigeben", cancel: "Buchung stornieren" }],
            headline2: [{ id: "ID der Buchung", email: "E-Mail-Adresse des Absolventen", createdAt: "Erstellungsdatum", cancel: "Buchung stornieren" }]
        };
        this.changeStep = this.changeStep.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getBookings = this.getBookings.bind(this);
        this.cancel = this.cancel.bind(this);
        this.approve = this.approve.bind(this);
        this.searchOpenHandler = this.searchOpenHandler.bind(this);
        this.searchPaidHandler = this.searchPaidHandler.bind(this);
    }

    componentDidMount() {
        //Ruft beim Laden der Komponente die aktuellen Buchungen ab, indem die Funktion getBookings aufgerufen wird
        this.getBookings();
    }


    async getBookings() {
        //Ruft die aktuellen Buchungen aus der Datenbank ab und speichert diese lokal ab
        const response = await fetch(Config.BACKEND_BASE_URI + '/api/v2/bookings/', {
            method: 'GET',
            mose: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
        }).catch(console.log);

        if (!response.ok) {
            switch (response.status) {
                case 500:
                    alert("Die Anmeldung ist aufgrund eines Server-Fehlers fehlgeschlagen. Bitte versuchen Sie es später erneut.");
                    break;
                case 501:
                    alert("Der Server kann die gewünschte Anfrage nicht ausführen.");
                    break;
                default:
                    alert(response.message);
            }
            return;
        } else {
            const rückgabe = await response.json().catch(console.log);
            if (rückgabe) {
                var lauf2 = 0;
                var lauf3 = 0;
                var speicher = [];
                var speicher2 = [];
                for (var lauf = 0; lauf < rückgabe.length; lauf++) {

                    if (rückgabe[lauf].paidAt !== null && rückgabe[lauf].canceled === false) {
                        if (rückgabe[lauf] !== null) {
                            speicher[lauf2] = rückgabe[lauf];
                        }
                        lauf2 = lauf2 + 1;
                    }
                    if (rückgabe[lauf].paidAt === null && rückgabe[lauf].canceled === false) {
                        if (rückgabe[lauf] !== null) {
                            speicher2[lauf3] = rückgabe[lauf];
                        }
                        lauf3 = lauf3 + 1;
                    }
                }
            }
            this.setState({ paid: speicher })
            this.setState({ open: speicher2 })
        }
    }

    async cancel(bookingId) {  
        //Storniert eine Buchung mit der angegebenen Buchungs-ID
        const response = await fetch(Config.BACKEND_BASE_URI + '/api/v2/bookings/' + bookingId, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
            body: JSON.stringify({ canceled: 1 })
        }).catch(console.log);

        if (!response.ok) {
            alert("Die Stornierung ist Fehlgeschlagen");
            return
        } else {
            alert("Die Buchung mit der Buchungs-ID " + bookingId + " wurde storniert.");
            this.componentDidMount();
        }
    }

    async approve(bookingId) {
        //Gibt die Buchung mit der angegebenen Buchungs-ID frei
        var today = new Date();
        today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + (today.getHours() + 2) + ':' + today.getMinutes() + ':' + today.getSeconds();
        const response = await fetch(Config.BACKEND_BASE_URI + '/api/v2/bookings/' + bookingId, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
            body: JSON.stringify({ paidAt: today })
        }).catch(console.log);

        if (!response.ok) {
            alert("Die Bestätigung ist fehlgeschlagen");
            return
        } else {
            alert("Die Buchung mit der Buchungs-ID " + bookingId + " wurde bestätigt.");
            this.componentDidMount();
        }
    }

    changeStep() {
        //Leitet den Besucher auf die allgemeine Übersichtsseite des Eventmanagements weiter
        window.location.assign('#/eventmgmt/shop');
    }

    searchOpenHandler(event) {
        //Speichert die Suchanfrage des TextInput-Feldes in den offenen Buchungen  
        this.setState({ searchOpen: event.target.value });
    }

    searchPaidHandler(event) {
        //Speichert die Suchanfrage des TextInput-Feldes in den bezahlten Buchungen
        this.setState({ searchPaid: event.target.value });
    }


    render() {
        //stellt die Buchungen und Filterfunktionen im Browser dar. Trennung zwischen offenen und bezahlten Buchungen
        var ansicht = [];
        let open;
        var mail = this.state.searchOpen;
        if (mail !== "") {
            open = this.state.open.filter((booking) => { return booking.user.email.toLowerCase().includes(mail.toLowerCase()) });
        } else {
            open = this.state.open;
        }

        let paid;
        var mail2 = this.state.searchPaid;
        if (mail2 !== "") {
            paid = this.state.paid.filter((booking) => { return booking.user.email.toLowerCase().includes(mail2.toLowerCase()) });
        } else {
            paid = this.state.paid;
        }
        return (
            ansicht[0] =
            <Box className="outerBoxOverview" direction="column" align="center">
                <Text weight="bold" size="xlarge">Bestellungsübersicht</Text>
                <Box pad="medium">
                    <Text>Hier können die Bestellungen eingesehen, freigegeben und storniert werden.</Text>
                    <Button label="Zurück zur Übersichtsseite" onClick={this.changeStep} pad="small"></Button>
                </Box>
                <Box pad="medium">
                    <Text>Offene Bestellungen: </Text>
                    <Box pad="small">
                        <List
                            pad="medium"
                            alignSelf="stretch"
                            margin="small"
                            primaryKey={(headline1) => { return <b key={headline1.id + 't'}> {headline1.id || 'Unknown'} </b> }}
                            secondaryKey={(headline1) => { return <span key={headline1.id + 's'}> {"|   " + headline1.email + "   |" || 'Unknown'} {headline1.createdAt + "   |" || 'Unknown'} {headline1.approve + "   |" || 'Unknown'} {headline1.cancel + "   |" || 'Unknown'} </span> }}
                            data={this.state.headline1}
                        />
                        <TextInput gap="small" placeholder="Zum Suchen in den offenen Buchungen bitte eine E-Mail-Adresse eingeben" value={this.state.searchOpen} onChange={this.searchOpenHandler}></TextInput>
                        <List
                            pad="medium"
                            alignSelf="stretch"
                            margin="small"
                            primaryKey={(openBooking) => { return <b key={openBooking.id + 't'}> {openBooking.id || 'Unknown'} </b> }}
                            secondaryKey={(openBooking) => { return <span key={openBooking.id + 's'}> {"|  " + openBooking.user.email + "    |" || 'Unknown'}     {(new Date(openBooking.createdAt).toLocaleDateString()) + "    |" || 'Unknown'} <Button label="Buchung freigeben" onClick={() => { this.approve(openBooking.id) }}></Button> | <Button label="Buchung stornieren" onClick={() => { this.cancel(openBooking.id) }}></Button></span> }}
                            data={open}
                        />
                    </Box>
                </Box>
                <Box pad="medium">
                    <Text>Abgeschlossene Bestellungen: </Text>
                    <Box pad="small">
                        <List
                            pad="medium"
                            alignSelf="stretch"
                            margin="small"
                            primaryKey={(headline2) => { return <b key={headline2.id + 't'}> {headline2.id || 'Unknown'} </b> }}
                            secondaryKey={(headline2) => { return <span key={headline2.id + 's'}> {"|   " + headline2.email + "   |" || 'Unknown'} {headline2.createdAt + "   |" || 'Unknown'} {headline2.cancel + "   |" || 'Unknown'} </span> }}
                            data={this.state.headline2}
                        />
                        <TextInput gap="small" placeholder="Zum Suchen in den bezahlten Buchungen bitte eine E-Mail-Adresse eingeben" value={this.state.searchPaid} onChange={this.searchPaidHandler}></TextInput>
                        <List pad="medium"
                            alignSelf="stretch"
                            margin="small"
                            primaryKey={(finishedBooking) => { return <b key={finishedBooking.id + 't'}> {finishedBooking.id || 'Unknown'} </b> }}
                            secondaryKey={(finishedBooking, test) => { return <span key={finishedBooking.id + 's'}> {"|  " + finishedBooking.user.email + "    |" || 'Unknown'}     {(new Date(finishedBooking.createdAt).toLocaleDateString()) + "    |" || 'Unknown'} <Button label="Buchung stornieren" onClick={() => { this.cancel(finishedBooking.id) }}></Button></span> }}
                            data={paid}
                        />
                    </Box>
                </Box>
            </Box>
        );
    }
}
export default ShopManagementViewBookings;