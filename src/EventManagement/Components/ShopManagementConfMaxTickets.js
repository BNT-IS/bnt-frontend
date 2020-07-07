import React from 'react';
import { Box, Button, Text, TextInput } from 'grommet';
import './ShopManagement.css';
import './ShopManagement.js';
import UserContext from '../../AppContexts/UserContext'

class ShopManagementConfMaxTickets extends React.Component {

    static contextType = UserContext;
    
    constructor(props) {
        super(props);
        this.state = {
            Absolvententickets: 0,
            Begleitertickets: 0,           
        }

        this.setValuesAndChangeStep = this.setValuesAndChangeStep.bind(this)
    }

    setValuesAndChangeStep (){
        this.props.setConfMaxTicketsFromConf(this.state.Absolvententickets, this.state.Begleitertickets);
        window.location.assign("#/eventmgmt/shop");
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
                        type="number"
                        placeholder="Absolvententickets"
                        value={this.state.Absolvententickets}
                        onChange={(event) => { this.setState({ Absolvententickets: parseInt(event.target.value)}) }}
                    />
                </Box>
                <Box pad="medium">
                    <Text weight="bold">Begleitertickets:</Text>
                    <TextInput
                        type="number"
                        placeholder="Begleitertickets"
                        value={this.state.Begleitertickets}
                        onChange={(event) => { this.setState({ Begleitertickets: parseInt(event.target.value)}) }}
                    />
                </Box>
                <Button label="Bestätigen" onClick={this.setValuesAndChangeStep}></Button>
            </Box >
        );
    }
}
export default ShopManagementConfMaxTickets;
