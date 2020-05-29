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
        this.state = { };
        this.connectRemoteTicketReader = this.connectRemoteTicketReader.bind(this);
    }

    /**
     * Initiates the RTC Peer connection to an instance of TicketReader on another device.
     */
    connectRemoteTicketReader() {
        let remoteTicketReader = new RemoteTicketReader();
        remoteTicketReader.onReady = () => {
            this.setState({ connectRTR: null });
            this.props.onRTR(remoteTicketReader);
        };
        remoteTicketReader.onOfferCode = (url) => {
            this.setState({ RTRQRCode: url });
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
                    Derzeit sind {this.props.RTRList.length} Ticket Leser verbunden.
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