import React from 'react';
import { Box, Button, Select, Text, List, TextInput, DataTable, Meter } from 'grommet';
import Config from '../../config';
import './ShopManagement.css';
import './ShopManagement.js';



class ShopManagementSalesStatistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
        this.changeStep = this.changeStep.bind(this);
    }

    changeStep (){
        this.props.changeInitializeStep(0)

    }
    

    render() {
        return (
            <Box className="outerBoxOverview" direction="column" align="center">
                
                <Button label="Bestätigen" onClick={this.changeStep}></Button>
            </Box >
        );
    }
}
export default ShopManagementSalesStatistics;
