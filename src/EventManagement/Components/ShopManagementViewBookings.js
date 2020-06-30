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
            open: [], paid: [], searchOpen: "", searchPaid: ""
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
        this.getBookings();
    }


    async getBookings() {
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
                        this.setState({ open: speicher2 })
                    }
                }
            }
            this.setState({ paid: speicher })
            this.setState({ open: speicher2 })
        }
    }

    async cancel(bookingId) {

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
        this.props.changeInitializeStep(0);
    }

    searchOpenHandler(event) {
        this.setState({ searchOpen: event.target.value });
    }

    searchPaidHandler(event) {
        this.setState({ searchPaid: event.target.value });
    }

    render() {
        var ansicht = [];
        return (
            ansicht[0] =
            <box className="outerBoxOverview" direction="column" align="center">
                <Text weight="bold" size="xlarge">Bestellungsübersicht</Text>
                <Box pad="medium">
                    <Text>Hier können die Bestellungen eingesehen, freigegeben und storniert werden.</Text>
                    <Button label="Zurück zur Übersichtsseite" onClick={this.changeStep} pad="small"></Button>
                </Box>
                <Box pad="medium">
                    <Text>Offene Bestellungen: </Text>
                    <Box pad="small">
                        <TextInput placeholder="Zum Suchen in den offenen Buchungen bitte eine E-Mail-Adresse eingeben" value={this.state.searchOpen} onChange={this.searchOpenHandler}></TextInput>
                    </Box>
                    <Box pad="small">
                        <Text>Buchungs-ID     |     User-Mail      |     Erstellungsdatum     |     Freigabe     |     Stornieren</Text>
                        <List pad="medium"
                            alignSelf="stretch"
                            margin="small"
                            primaryKey={(openBooking) => { return <b key={openBooking.id + 't'}> {openBooking.id || 'Unknown'} </b> }}
                            secondaryKey={(openBooking) => { return <span key={openBooking.id + 's'}> {"|  " + openBooking.user.email + "    |" || 'Unknown'}     {(new Date(openBooking.createdAt).toLocaleDateString()) + "    |" || 'Unknown'} <Button label="Buchung freigeben" onClick={() => { this.approve(openBooking.id) }}></Button> | <Button label="Buchung stornieren" onClick={() => { this.cancel(openBooking.id) }}></Button></span> }}
                            data={this.state.open}
                        />
                    </Box>
                </Box>
                <Box pad="medium">
                    <Text>Abgeschlossene Bestellungen: </Text>
                    <Box pad="small">
                        <TextInput placeholder="Zum Suchen in den bezahlten Buchungen bitte eine E-Mail-Adresse eingeben" value={this.state.searchPaid} onChange={this.searchPaidHandler}></TextInput>
                    </Box>
                    <Box pad="small">
                    <Text>Buchungs-ID     |     User-Mail      |     Erstellungsdatum     |     Stornieren</Text>
                        <List pad="medium"
                            alignSelf="stretch"
                            margin="small"
                            primaryKey={(finishedBooking) => { return <b key={finishedBooking.id + 't'}> {finishedBooking.id || 'Unknown'} </b> }}
                            secondaryKey={(finishedBooking, test) => { return <span key={finishedBooking.id + 's'}> {"|  " + finishedBooking.user.email + "    |" || 'Unknown'}     {(new Date(finishedBooking.createdAt).toLocaleDateString()) + "    |" || 'Unknown'} <Button label="Buchung stornieren" onClick={() => { this.cancel(finishedBooking.id) }}></Button></span> }}
                            data={this.state.paid}
                        />
                    </Box>
                </Box>
            </box>
        );
    }

}
export default ShopManagementViewBookings;