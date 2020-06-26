import React from 'react';
import { Box, Button, Text, TextInput } from 'grommet';

import './ShopManagement.css';
import './ShopManagement.js';

class ShopManagementConfMaxTickets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Absolvententickets: "",
            Begleitertickets: "",
            Parktickets: "",            
        }
        this.changeValues = this.changeValues.bind(this);
        this.setValuesAndChangeStep = this.setValuesAndChangeStep.bind(this)
    }

    async changeValues() {
        /* TODO: NEU EINFÜGEN UND ANPASSEN 
            var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/setup/", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 91ba3c0f6ae8d56c4714260a8dbb7c6ce606797be4fb79eedfc73e4d6f212d255487b44e9c1b264deca11183605744c4c8c70d01b097872b41551c7a5dc8af3b7b7f755388835c67b8b094de2253e9ac95850e0575717ea5c3a9efa7239a0adaa70f6fcffec09f4b25ee4b6118fe0e9483f0d3faf8be0976a608460b0ad2156c0ddcc5f483db50404c2f6567b16a6087682d10c4ec22935be53f164a206d3f592baad81c301496b5ff5fca105e65a4121e1f0ae327d9eb5ae8f3f754fdbe7187f6a83e9e6fbe789268d8292521760e1b3f1dcb2a162b55a5b8b8089b21b996e1875f14b0b705a9cbcc806f4f3c4ac229cd3740175b0bf610bd514447430d2f15',
            }
        }).catch(console.log)

        if (!response) return
        */
        //var data = await response.json().catch(console.log)

        //if (!data) return
        /*
        var kopieTickets = this.state.tickets;
        kopieTickets = kopieTickets.concat(data);

        this.setState({ tickets: kopieTickets });
        */
    }


    setValuesAndChangeStep (){
        this.props.setMaxTicketMenge(this.state.Absolvententickets, this.state.Begleitertickets, this.state.Parktickets)
        this.props.changeInitializeStep(0)
    }

    render() {
        var Ansicht = [];
        return (
            Ansicht[0]=
            <Box className="outerBoxOverview" direction="column" align="center">
                <Text weight="bold" size="xxlarge">Ticketkonfiguration</Text>
                <Box pad="medium"></Box>
                Hier können die maximalen Tickets, die ein Benutzer (Absolvent) erwerben kann, konfiguriert werden. 
                <Box pad="medium">
                    <Text weight="bold">Absolvententickets:</Text>
                    <TextInput
                        placeholder="Absolvententickets"
                        value={this.state.Absolvententickets}
                        onChange={(event) => { this.setState({ Absolvententickets: event.target.value }) }}
                    />
                </Box>
                <Box pad="medium">
                    <Text weight="bold">Begleitertickets:</Text>
                    <TextInput
                        placeholder="Begleitertickets"
                        value={this.state.Begleitertickets}
                        onChange={(event) => { this.setState({ Begleitertickets: event.target.value }) }}
                    />
                </Box>
                <Box pad="medium">
                    <Text weight="bold">Parktickets:</Text>
                    <TextInput
                        placeholder="Parktickets"
                        value={this.state.Parktickets}
                        onChange={(event) => { this.setState({ Parktickets: event.target.value }) }}
                    />
                </Box>
                <Button label="Bestätigen" onClick={this.setValuesAndChangeStep}></Button>
            </Box >
        );
    }
}
export default ShopManagementConfMaxTickets;
