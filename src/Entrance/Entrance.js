import React from 'react';
import { Box, Button, Text } from 'grommet';
import QRScanner from '../Utilities/Components/QRScanner';
import Dialog from '../Utilities/Components/Dialog';

import TicketReader from '../EventManagement/Classes/TicketReader';

import QRCode from 'qrcode';
import pako from 'pako';

class Entrance extends React.Component {

    constructor(props) {
        super(props);
        this.state = { connected: null, currentTicket: null };
        this.connectTicketReader = this.connectTicketReader.bind(this);
        this.scanDoneHandler = this.scanDoneHandler.bind(this);
        this.capturedTicketHandler = this.capturedTicketHandler.bind(this);
        this.obliterateTicketHandler = this.obliterateTicketHandler.bind(this);
        this.closeTicketViewHandler = this.closeTicketViewHandler.bind(this);
        /**
         * @type {TicketReader}
         */
        this.ticketReader = null;
    }

    translateTicketType(ticketType){
        switch (ticketType) {
            case "0": return "Absolvent";
            case "1": return "Begleitperson";
            case "2": return "Parkticket";
            default: break;
        }
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

    /**
     * @typedef TicketCodeData
     * @property {String} id - Hex string of the identifier
     * @property {String} sIG - Secret ingredient of the user to calculate the hash 
     */

    /**
     * Handler for the scanner when the ticket was scanned
     * @param {TicketCodeData} data - The data from the QR-Code of the ticket
     */
    async capturedTicketHandler(data) {
        try {
            let ticketData = JSON.parse(data);
            if (!ticketData.id || !ticketData.sIG) throw Error("Fehlende Angaben im Ticket-QR-Code. Möglicherweise liegt eine Fälschung vor.");
            let ticket = await this.ticketReader.readTicketRemote(ticketData.id);
            this.setState({ currentTicket: ticket, currentSecretIngredient: ticketData.sIG });
        } catch (error) {
            alert(error);
        }
    }

    /**
     * Obliterates a ticket in the IDB
     */
    async obliterateTicketHandler() {
        try {
            await this.ticketReader.obliterateTicketRemote(this.state.currentTicket.identifier, this.state.currentSecretIngredient);
            alert('Erfolgreich entwertet!');
            this.closeTicketViewHandler();
        } catch (error) {
            alert(error);
        }
    }

    closeTicketViewHandler() {
        this.setState({ currentTicket: null, currentSecretIngredient: null });
    }

    render() {
        return (
            <Box className="Entrance" pad="medium">
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
                    <Box>
                        <p>Sie sind verbunden</p>
                        {this.state.currentTicket === null && <QRScanner onDone={this.capturedTicketHandler} label="Scanvorgang starten"></QRScanner>}
                        {this.state.currentTicket &&
                            <Box>
                                <h1>{this.state.currentTicket.surname}, {this.state.currentTicket.forename}</h1>
                                <Text size="2em" pad="small">{this.translateTicketType(this.state.currentTicket.ticketType)}</Text>
                                <Text size="2em" pad="small">{(this.state.currentTicket.isValid && !this.state.currentTicket.isUsed) ? 'OK' : 'Ungültiges Ticket!'}</Text>
                                <Box gap="small">
                                    <Button label="Entwerte Ticket" onClick={this.obliterateTicketHandler}></Button>
                                    <Button label="Schließen" onClick={this.closeTicketViewHandler}></Button>
                                </Box>
                            </Box>
                        }
                    </Box>
                }
                {this.state.connected === 'disconnected' &&
                    <Box>
                        <p>Die Verbindung wurde unterbrochen!</p>
                        <p>Bitte warten Sie einen Moment...</p>
                        <p className="loader"></p>
                    </Box>
                }
                {this.state.connected === 'failed' &&
                    <Box>
                        <p>Die Verbindung wurde unterbrochen!</p>
                        <p>Bitte aktivieren Sie den Reader erneut.</p>
                        <Button onClick={() => { this.setState({ connected: null }); this.connectTicketReader() }} label="Ticket Reader Aktivieren"></Button>
                    </Box>
                }
            </Box>
        );
    }
}

export default Entrance;
