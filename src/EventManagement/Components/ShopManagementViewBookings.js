import React from 'react';
import { Box, Button, Text, List } from 'grommet';
import Config from '../../config';
import './ShopManagement.css';
import './ShopManagement.js';
import UserContext from '../../AppContexts/UserContext'

class ShopManagementViewBookings extends React.Component {

    static contextType = UserContext;


    constructor(props) {
        super(props);
        this.state = {
            open: [], paid: []
        };
        this.changeStep = this.changeStep.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getBookings = this.getBookings.bind(this);
        this.cancel = this.cancel.bind(this);
        this.approve = this.approve.bind(this);
    }

    componentDidMount(){
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
                        this.setState({open: speicher2})
                    }          
                }
            }
            this.setState({paid: speicher})
            this.setState({open: speicher2})
        }
    }

    cancel(bookingId){
        alert("Die Buchung mit der Buchungs-ID " + bookingId + " wurde storniert.");
    }

    approve(bookingId){
        alert("Die Buchung mit der Buchungs-ID " + bookingId + " wurde bestätigt.");
    }

    changeStep() {
        this.props.changeInitializeStep(0);
    }

    render() {
        var ansicht = [];
        return (
            ansicht[0] =
            <box className="outerBoxOverview" direction="column" align="center">
                <Text weight="bold" size="xlarge">Bestellungsübersicht</Text>
                <Box pad="medium">
                    <Text>Hier können die Bestellungen eingesehen, freigegeben und storniert werden.</Text>
                </Box>
                <Box pad="medium">
                    <Box pad="large">
                    <Text>Offene Bestellungen: </Text>
                    <Text>Buchungs-ID     |     User-ID      |     Erstellungsdatum     |     Freigabe     |     Stornieren</Text>
                    </Box>       
                    <List pad="medium"  
                          alignSelf="stretch"
                          margin="small" 
                          primaryKey={(openBooking) => {return <b key={openBooking.id + 't'}> {openBooking.id || 'Unknown'} </b>}}
                          secondaryKey={(openBooking) => {return <span key={openBooking.id + 's'}> {"|  " + openBooking.userId + "    |" || 'Unknown'}     {openBooking.createdAt + "    |" || 'Unknown'} <Button label="Buchung freigeben" onClick={""}></Button> | <Button label="Buchung stornieren" onClick={""}></Button></span>}} 
                          data={this.state.open}
                    />
                </Box>
                <Box pad="medium">
                    <Box pad="large">
                    <Text>Abgeschlossene Bestellungen: </Text>
                    <Text>Buchungs-ID     |     User-ID      |     Erstellungsdatum     |     Stornieren</Text>
                    </Box>
                    <List pad="medium" 
                          alignSelf="stretch"
                          margin="small"  
                          primaryKey={(finishedBooking) => {return <b key={finishedBooking.id + 't'}> {finishedBooking.id || 'Unknown'} </b>}}
                          secondaryKey={(finishedBooking) => {return <span key={finishedBooking.id + 's'}> {"|  " + finishedBooking.userId + "    |" || 'Unknown'}     {finishedBooking.createdAt + "    |" || 'Unknown'} <Button label="Buchung stornieren" onClick={""}></Button></span>}} 
                          data={this.state.paid}
                    />
                </Box>
                <Button label="Zurück zur Übersicht" onClick={this.changeStep}></Button>
            </box>
        );
    }

}
export default ShopManagementViewBookings;