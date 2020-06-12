import React from 'react';
//import './TicketOverview.css';
import { Box, Button, Accordion, AccordionPanel, Select } from 'grommet';

class InitialeListeEinlesen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { listeEingelesen: false, initialeListe: [] };
    }

    render() {
        if (!this.state.ListeEingelesen);
        return;
    }

}

class SystemInitalisierung extends React.Component {

    constructor(props) {
        super(props);
        this.state = { dateiTyp: "none" };
        this.inputDatatype = this.inputDatatype.bind(this);
        
    }

    inputDatatype(dateiTyp){
            const [value, setValue] = this.state.dateiTyp;
            return (
              <Select
                options={['CSV', 'XLSX']}
                value={value}
                onChange={({ option }) => setValue(option)}
              />
            );
    }

    render() {
        var Anzeige = this.inputDatatype('CSV');

        return (
            <Box className="SystemInitalisierung" direction="column" gap="medium" pad="medium">
                <Box className="Auswahlmenü"> 
                {Anzeige}
                </Box>
            </Box>

        );
    }
}

export default SystemInitalisierung;
