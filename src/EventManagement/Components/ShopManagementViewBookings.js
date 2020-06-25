import React from 'react';
import { Box, Button, Select, Text, List, TextInput, DataTable, Meter } from 'grommet';
import Config from '../../config';
import './ShopManagement.css';
import './ShopManagement.js';

class ShopManagementViewBookings extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};

    }
    changeStep(){
        this.props.changeInitializeStep(0);
    }

    render(){
        var Ansicht = []
        return(
            Ansicht[0] = <Box> Hallo </Box>
        );
    }

}
export default ShopManagementViewBookings;