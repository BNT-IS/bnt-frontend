import React from 'react';
import { Box, Button } from 'grommet';

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
