import React from 'react';
import { Box, Button, List } from 'grommet';
import QRScanner from '../../Utilities/Components/QRScanner';
import Dialog from '../../Utilities/Components/Dialog';

import RemoteTicketReader from '../Classes/RemoteTicketReader';

import QRCode from 'qrcode';
import pako from 'pako';

/**
 * The main unit (master) to which instances of TicketReader can connect.
 */
class TicketReaderManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.connectRemoteTicketReader = this.connectRemoteTicketReader.bind(this);
        this.scanDoneHandler = this.scanDoneHandler.bind(this);
    }

    scanDoneHandler(binaryString){
        let config = JSON.parse(pako.inflate(binaryString, { to: 'string' }));
        this.state.connectRTR.setTicketReaderConfig(config);
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
        remoteTicketReader.onOffer = async (config) => {
            // Compress data
            let binaryString = pako.deflate(JSON.stringify(config), { level: 9, to: "string" });

            // Create QR Code
            let url = await QRCode.toDataURL(binaryString).catch(console.error);
            this.setState({ RTRQRCode: url });
        }
        this.setState({ connectRTR: remoteTicketReader, addRTRStep: 0 });
    }

    render() {
        return (
            <Box className="TicketReaderManager" pad="medium">
                <p>
                    Derzeit sind {this.props.RTRList.length} Ticket Leser verbunden.
                </p>
                <List
                    primaryKey={(rtr) => { return <b key={rtr.uuid + 't'}> {rtr.uuid} - {rtr.localPeerConnection.connectionState} </b> }}
                    secondaryKey={(rtr) => { return <span key={rtr.uuid + 's'}> Click to remove </span> }}
                    onClickItem={this.props.onRemoveRTR}
                    data={this.props.RTRList}
                />
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
                                    <p>Gehen Sie mit dem Zielgerät auf die Unterseite #/entrance/</p>
                                    <p>Scannen Sie den angezeigten QR-Code anschließend mit dem Zielgerät</p>
                                </div>
                                <div className="ticket-reader-action">
                                    <Button onClick={() => { this.setState({ addRTRStep: 1 }); }} label="Weiter"></Button>
                                </div>
                            </div>
                        }
                        {this.state.addRTRStep === 1 &&
                            <div>
                                <div className="ticket-reader-scanner">
                                    <QRScanner onDone={this.scanDoneHandler} label="Scanvorgang starten"></QRScanner>
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