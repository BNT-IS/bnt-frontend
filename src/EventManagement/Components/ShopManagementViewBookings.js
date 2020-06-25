import React from 'react';
import { Box, Button, Select, Text, List, TextInput, DataTable, Meter } from 'grommet';
import Config from '../../config';
import './ShopManagement.css';
import './ShopManagement.js';

class ShopManagementViewBookings extends React.Component{

    constructor(props) {
        super(props);
        this.state = {

        };
        this.changeStep = this.changeStep.bind(this);
    }
    changeStep(){
        this.props.changeInitializeStep(0);
    }

    render(){
        var ansicht = [];
        return(
            ansicht[0] =
            <box className="outerBoxOverview" direction="column" align="center">
                <Text weight="bold" size="xlarge">Bestellungsübersicht</Text>
                <Box pad="medium"></Box>
                <Text>Hier können die Bestellungen eingesehen und freigegeben werden.</Text>
                <Box pad="medium"></Box>
                <Button label="Zurück zur Übersicht" onClick={this.changeStep}></Button>
            </box>
        );
    }

}
export default ShopManagementViewBookings;