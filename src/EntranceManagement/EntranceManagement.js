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
        this._closedHandler = this._closedHandler.bind(this);
        this._readyHandler = this._readyHandler.bind(this);
        this._abortHandler = this._abortHandler.bind(this);
    }

    connectTicketReader() {
        this.ticketReader = <TicketReader
            onAbort={this._abortHandler}
            onReady={this._readyHandler}
            onClosed={this._closedHandler}></TicketReader>;
        this.setState({ connectTR: this.ticketReader });
    }

    _abortHandler() {
        this.setState({ connectTR: null });
    }

    _closedHandler() {
        this.setState({ connected: false });
    }

    _readyHandler() {
        this.setState({ connectTR: null, connected: true });
    }

    render() {
        return (
            <Box className="EntranceManagement" pad="medium">
                {!this.state.connected &&
                    <Box>
                        <p>Wenn Sie dieses Gerät als Ticket Leser verwenden möchten, müssen Sie es erst mit dem Event-Manager verbinden.</p>
                        <p>Bitte stellen Sie sicher, dass dieses Gerät mit dem selben lokalen Netzwerk, wie der Event-Manager verbunden ist.</p>
                        <Button onClick={this.connectTicketReader} label="Ticket Reader Aktivieren"></Button>
                        {this.state.connectTR}
                    </Box>
                }
                {this.state.connected &&
                    <Switch>
                        <Route path="/entrance/test">
                            {!this.state.account && <QRScanner contentType="ETHEREUM_ADDRESS" onDone={this.scanDoneHandler}></QRScanner>}
                            {this.state.account &&
                                <ObliteratePanel
                                    account={this.state.account}
                                    onStartObliterate={this.obliterateTokens}>
                                </ObliteratePanel>}
                        </Route>
                        <Route path="/entrance/">
                            <p>Wunderbar, Sie sind verbunden...</p>
                            <p>In Zukunft sollten hier Funktionen zum Ticket-Scan stehen...</p>
                            <Button label="Beispiel Funktion 1"></Button>
                            <Button label="Beispiel Funktion 2"></Button>
                            <Button label="Beispiel Funktion 3"></Button>
                        </Route>
                    </Switch>
                }
            </Box>
        );
    }
}

export default EntranceManagement;
