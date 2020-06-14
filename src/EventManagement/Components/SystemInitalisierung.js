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
        this.state = { dateiTyp: "CSV" };
        

    }

    // TODO: Step fürs Aufsetzen von Master-User mit Wallet
    // TODO: Step fürs Initialisieren der DB
    // TODO: Step fürs Aufladen des Backend-Wallets mit Ether...

    render() {

        return (
            <Box className="SystemInitalisierung" direction="column" gap="medium" pad="medium">
                <Box className="Auswahlmenü">
                    <Select
                        options={['CSV', 'XLSX']}
                        value={this.state.dateiTyp}
                        onChange={({ value, option }) => {this.setState({dateiTyp: option})}}
                    />
                </Box>
            </Box>

        );
    }
}

export default SystemInitalisierung;
