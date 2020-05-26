import React from 'react';
import { Box, Button } from 'grommet';
import QRScanner from '../../Utilities/Components/QRScanner';
import Dialog from '../../Utilities/Components/Dialog';

import RemoteTicketReader from '../Classes/RemoteTicketReader';

/**
 * The main unit (master) to which instances of TicketReader can connect.
 */
class TicketReaderManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = { RTRList: [] };
        this.connectRemoteTicketReader = this.connectRemoteTicketReader.bind(this);
    }

    /**
     * Initiates the RTC Peer connection to an instance of TicketReader on another device.
     */
    connectRemoteTicketReader() {
        let remoteTicketReader = new RemoteTicketReader();
        remoteTicketReader.onReady = () => {
            this.setState({ connectRTR: null });
            let rTR = this.state.RTRList;
            rTR.push(remoteTicketReader);
            this.setState({ RTRList: rTR });
        };
        remoteTicketReader.onDisconnected = () => {
            console.debug("Attempting to remove closed ticketreader");
            let rTR = this.state.RTRList;
            let idx = rTR.indexOf(remoteTicketReader);
            rTR.splice(idx, 1);
            this.setState({ RTRList: rTR });
        }
        remoteTicketReader.onOfferCode = (url) => {
            this.setState({ RTRQRCode: url });
        }
        remoteTicketReader.onGetTicket = (params) => {
            // TODO: Request localmirror 
        }
        remoteTicketReader.onObliterateTicket = (params) => {
             // TODO: Request localmirror 
        }
        this.setState({ connectRTR: remoteTicketReader, addRTRStep: 0 });
    }

    disconnectRemoteTicketReader(remoteTicketReader) {

    }

    disconnectAll() {

    }

    render() {
        return (
            <Box className="TicketReaderManager" pad="medium">
                <p>
                    Derzeit sind {this.state.RTRList.length} Ticket Leser verbunden.
                </p>
                <Button onClick={this.connectRemoteTicketReader} label="Ticket Leser Hinzufügen"></Button>
                {this.state.connectRTR &&
                    <Dialog title="Remote Ticket Reader Hinzufügen" onAbort={() => { this.setState({ connectRTR: null }); }}>
                        {this.state.addRTRStep === 0 &&
                            <div>
                                <div className="ticket-reader-qrcode">
                                    {!this.state.RTRQRCode && <div className="loader">Loading...</div>}
                                    {this.state.RTRQRCode && <img src={this.state.RTRQRCode} width="100%" alt="Ein QR-Code sollte hier angezeigt werden." />}
                                </div>
                                <div className="ticket-reader-description">
                                    <p>Bitte mit dem Zielgerät scannen</p>
                                </div>
                                <div className="ticket-reader-action">
                                    <Button onClick={() => { this.setState({ addRTRStep: 1 }); }} label="Weiter"></Button>
                                </div>
                            </div>
                        }
                        {this.state.addRTRStep === 1 &&
                            <div>
                                <div className="ticket-reader-scanner">
                                    <QRScanner onDone={this.state.connectRTR.setTicketReaderConfig} label="Scanvorgang starten"></QRScanner>
                                </div>
                                <div className="ticket-reader-description">
                                    <p>Bitte nun den Code des Zielgeräts scannen</p>
                                </div>
                            </div>
                        }
                    </Dialog>
                }
            </Box>
        );
    }

}

export default TicketReaderManager;