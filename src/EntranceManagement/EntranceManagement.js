import React from 'react';
import { Box, Button } from 'grommet';
import { Switch, Route } from "react-router-dom";
import QRScanner from '../Utilities/QRScanner';
import ObliteratePanel from './ObliteratePanel';

import { TicketReader } from '../EventManagement/TicketReaderManager';

class EntranceManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.connectTicketReader = this.connectTicketReader.bind(this);
    }

    connectTicketReader() {
        let ticketReader = <TicketReader
            onAbort={() => { this.setState({ connect: null }); }}
            onReady={() => { this.setState({ connect: null }); this.ticketReader = ticketReader; }}></TicketReader>;
        this.setState({ connect: ticketReader });
    }

    render() {
        return (
            <Box className="EntranceManagement" pad="medium">
                <p>Wenn Sie dieses Gerät als Ticket Leser verwenden möchten, müssen Sie es erst mit dem Event-Manager verbinden.</p>
                <Button onClick={this.connectTicketReader} label="Ticket Reader Aktivieren"></Button>
                {this.state.connect}
                {false &&
                    <Switch>
                        <Route path="/entrance/test">
                            {!this.state.account && <QRScanner contentType="ETHEREUM_ADDRESS" onDone={this.scanDoneHandler}></QRScanner>}
                            {this.state.account &&
                                <ObliteratePanel
                                    account={this.state.account}
                                    onStartObliterate={this.obliterateTokens}>
                                </ObliteratePanel>}
                        </Route>
                    </Switch>
                }
            </Box>
        );
    }
}

export default EntranceManagement;
