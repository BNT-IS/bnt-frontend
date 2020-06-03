import React from 'react';
import { Box, Button } from 'grommet';
import { Switch, Route } from "react-router-dom";
import QRScanner from '../Utilities/Components/QRScanner';
import Dialog from '../Utilities/Components/Dialog';

import TicketReader from '../EventManagement/Classes/TicketReader';

import QRCode from 'qrcode';
import pako from 'pako';

class EntranceManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = { connected: null };
        this.connectTicketReader = this.connectTicketReader.bind(this);
        this.scanDoneHandler = this.scanDoneHandler.bind(this);
        /**
         * @type {TicketReader}
         */
        this.ticketReader = null;
    }

    connectTicketReader() {
        let ticketReader = new TicketReader();
        ticketReader.onReady = () => {
            this.ticketReader = this.state.connectTR;
            this.setState({ connectTR: null });
        };
        ticketReader.onConnectionChanged = (connectionState) => {
            switch (connectionState) {
                case "connected":
                    // The connection has become fully connected
                    this.setState({ connected: connectionState });
                    break;
                case "disconnected":
                    this.setState({ connected: connectionState });
                    break;
                case 'failed':
                    this.setState({ connected: connectionState });
                    break;
                case "closed":
                    // The connection has been closed
                    this.setState({ connected: connectionState });
                    break;
                default:
                    break;
            }
        };
        ticketReader.onAnswer = async (config) => {
            // Compress data
            let binaryString = pako.deflate(JSON.stringify(config), { level: 9, to: "string" });

            // Create QR Code
            let url = await QRCode.toDataURL(binaryString).catch(console.error);
            this.setState({ TRQRCode: url, connectTRStep: 1 });
        };
        this.setState({ connectTR: ticketReader, connectTRStep: 0 });
    }

    scanDoneHandler(binaryString) {
        let obj = JSON.parse(pako.inflate(binaryString, { to: 'string' }));
        this.state.connectTR.setMasterConfig(obj);
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
                                            <QRScanner onDone={this.scanDoneHandler} label="Scanvorgang starten"></QRScanner>
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
                {this.state.connected === 'connected' &&
                    <Switch>
                        <Route path="/entrance/">
                            <p>Wunderbar, Sie sind verbunden...</p>
                            <p>In Zukunft sollten hier Funktionen zum Ticket-Scan stehen...</p>
                            <Button label="Lese ein Beispiel Ticket" onClick={() => { this.ticketReader.readTicketRemote("2537f4c1-2bfa-416f-9098-9b61fe4bb59d") }}></Button>
                            <Button label="Entwerte Ticket" onClick={() => { this.ticketReader.obliterateTicketRemote(123, "signature") }}></Button>
                            <Button label="Beispiel Funktion 3"></Button>
                        </Route>
                    </Switch>
                }
                {this.state.connected === 'disconnected' &&
                    <Switch>
                        <Route path="/entrance/">
                            <p>Die Verbindung wurde unterbrochen!</p>
                            <p>Bitte warten Sie einen Moment...</p>
                        </Route>
                    </Switch>
                }
                {this.state.connected === 'failed' &&
                    <Switch>
                        <Route path="/entrance/">
                            <p>Die Verbindung wurde unterbrochen!</p>
                            <p>Bitte aktivieren Sie den Reader erneut.</p>
                            <Button onClick={() => { this.setState({ connected: null }); this.connectTicketReader() }} label="Ticket Reader Aktivieren"></Button>
                        </Route>
                    </Switch>
                }
            </Box>
        );
    }
}

export default EntranceManagement;
