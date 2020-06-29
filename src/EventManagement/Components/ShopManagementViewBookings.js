import React from 'react';
import { Box, Button, Text } from 'grommet';
 
import './ShopManagement.css';
import './ShopManagement.js';
import UserContext from '../../AppContexts/UserContext'

class ShopManagementViewBookings extends React.Component {

    static contextType = UserContext;


    constructor(props) {
        super(props);
        this.state = {
            offen: [], bezahlt: []
        };
        this.changeStep = this.changeStep.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getBookings = this.getBookings.bind(this);
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
                for (var lauf = 0; lauf < rückgabe.length; lauf++) {
                    if (rückgabe[lauf].paidAt !== null && rückgabe[lauf].canceled === false) {
                        if (rückgabe[lauf] !== null) {
                            var lauf2 = this.state.bezahlt.length;
                            this.state.bezahlt[lauf2] = rückgabe[lauf];
                        }
                    }
                    if (rückgabe[lauf].paidAt === null && rückgabe[lauf].canceled === false) {
                        if (rückgabe[lauf] !== null) {
                            var lauf3 = this.state.offen.length;
                            this.state.offen[lauf3] = rückgabe[lauf];
                        }
                    }
                }
                console.log(this.state.offen);
                console.log(this.state.bezahlt);
            }
        }
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
                    <Text>Offene Bestellungen: </Text>
                    <Text>Platzhalter</Text>
                    <List primaryKey="id" secondaryKey="userId" data={this.state.offen[0]}>
                    </List>
                </Box>
                <Box pad="medium">
                    <Text>Abgeschlossene Bestellungen: </Text>
                    <Text>Platzhalter</Text>
                </Box>
                <Button label="Zurück zur Übersicht" onClick={this.changeStep}></Button>
            </box>
        );
    }

}
export default ShopManagementViewBookings;