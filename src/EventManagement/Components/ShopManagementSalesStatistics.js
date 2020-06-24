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
    }

    

    render() {
        return (
            <Box className="outerBoxOverview" direction="column" align="center">
                
                <Button label="Bestätigen"></Button>
            </Box >
        );
    }
}
export default ShopManagementSalesStatistics;
