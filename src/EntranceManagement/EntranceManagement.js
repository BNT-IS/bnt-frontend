import React from 'react';
import { Box, Button } from 'grommet';
import { Switch, Route } from "react-router-dom";
import QRScanner from '../Utilities/QRScanner';
import Dialog from '../Utilities/Dialog';

import { TicketReader } from '../EventManagement/TicketReaderManager';

class EntranceManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = { connected: false };
        this.connectTicketReader = this.connectTicketReader.bind(this);
    }

    connectTicketReader() {
        let ticketReader = new TicketReader();
        ticketReader.onReady = () => {
            this.ticketReader = this.state.connectTR;
            this.setState({ connectTR: null, connected: true });
        };
        ticketReader.onDisconnected = () => {
            this.ticketReader = null;
            this.setState({ connected: false });
        };
        ticketReader.onAnswerCode = (url) => {
            this.setState({ TRQRCode: url, connectTRStep: 1 });
        };
        this.setState({ connectTR: ticketReader, connectTRStep: 0 });
    }

    render() {
        return (
            <Box className="EntranceManagement" pad="medium">
                {!this.state.connected &&
                    <Box>
                        <p>Wenn Sie dieses Gerät als Ticket Leser verwenden möchten, müssen Sie es erst mit dem Event-Manager verbinden.</p>
                        <p>Bitte stellen Sie sicher, dass dieses Gerät mit dem selben lokalen Netzwerk, wie der Event-Manager verbunden ist.</p>
                        <Button onClick={this.connectTicketReader} label="Ticket Reader Aktivieren"></Button>
                        {this.state.connectTR &&
                            <Dialog title="Als Ticket Reader verbinden" onAbort={() => { this.setState({ connectTR: null }); }}>
                                {this.state.connectTRStep === 0 &&
                                    <div>
                                        <div className="scanner">
                                            <QRScanner onDone={this.state.connectTR.setMasterConfig} label="Scanvorgang starten"></QRScanner>
                                        </div>
                                        <div className="description">
                                            <p>Bitte den Code des Initiators scannen</p>
                                        </div>
                                    </div>
                                }
                                {this.state.connectTRStep === 1 &&
                                    <div>
                                        <div className="qrcode">
                                            {!this.state.TRQRCode && <div className="loader">Loading...</div>}
                                            {this.state.TRQRCode && <img src={this.state.TRQRCode} width="100%" alt="Ein QR-Code sollte hier angezeigt werden." />}
                                        </div>
                                        <div className="description">
                                            <p>Bitte nun mit dem Initiator Gerät scannen</p>
                                        </div>
                                    </div>
                                }
                            </Dialog>
                        }
                    </Box>
                }
                {this.state.connected &&
                    <Switch>
                        <Route path="/entrance/">
                            <p>Wunderbar, Sie sind verbunden...</p>
                            <p>In Zukunft sollten hier Funktionen zum Ticket-Scan stehen...</p>
                            <Button label="Lese Ticket" onClick={() => { this.ticketReader.readTicketRemote(123) }}></Button>
                            <Button label="Entwerte Ticket" onClick={() => { this.ticketReader.obliterateTicketRemote(123, "signature") }}></Button>
                            <Button label="Beispiel Funktion 3"></Button>
                        </Route>
                    </Switch>
                }
            </Box>
        );
    }
}

export default EntranceManagement;
