import React from 'react';
import { Box, Button } from 'grommet';
import QRScanner from '../Utilities/QRScanner';

// eslint-disable-next-line
import adapter from 'webrtc-adapter';
import QRCode from 'qrcode';

import './dialog.css';

/**
 * Represents an object holder for diverse connectio objects to the ticket reader.
 */
class RemoteTicketReader extends React.Component {

    constructor(props) {
        super(props);
        this.state = { step: 0 };
        this._iceCandidatesHandler = this._iceCandidatesHandler.bind(this);
        this._dataChannelOpenHandler = this._dataChannelOpenHandler.bind(this);
        this._generateOfferCode = this._generateOfferCode.bind(this);
        this._abortHandler = this._abortHandler.bind(this);
        this._scanDoneHandler = this._scanDoneHandler.bind(this);
        this._initConnection();
    }

    _initConnection() {
        const servers = null;
        const dataConstraint = null;

        this.icecandidates = [];

        this.localPeerConnection = new RTCPeerConnection(servers);
        this.localPeerConnection.addEventListener('icecandidate', this._iceCandidatesHandler);
        this.localPeerConnection.addEventListener('iceconnectionstatechange', this._connectionChangeHandler);

        this.dataChannel = this.localPeerConnection.createDataChannel('sendDataChannel', dataConstraint);
        this.dataChannel.addEventListener('message', this._messageHandler);
        this.dataChannel.addEventListener('open', this._dataChannelOpenHandler);
        this.dataChannel.addEventListener('close', this._dataChannelClosedHandler);

        this._createOffer();
    }

    _iceCandidatesHandler(event) {
        if (this.icecandidates.length <= 1) { // Constrain the candidates to max. 2
            this.icecandidates.push(event.candidate);
        }
        if (this.offer && !this.qrcode) {
            setTimeout(this._generateOfferCode, 100); // Set a delay to collect some more icecandidates
        }
    }

    _connectionChangeHandler(event) {
        console.log(event);
    }

    _dataChannelOpenHandler(event) {
        console.log(event);
        this.props.onReady();
        this.dataChannel.send('Hallo Client!');
    }

    _dataChannelClosedHandler(event) {
        console.log(event);
    }

    _messageHandler(event) {
        alert(event.data);
    }

    _readTicketRemote() {

    }

    _obliterateTicketRemote() {

    }

    async _createOffer() {
        this.offer = await this.localPeerConnection.createOffer().catch(console.error);
        await this.localPeerConnection.setLocalDescription(this.offer).catch(console.error);
    }

    async _generateOfferCode() {
        let data = { offer: this.offer, candidates: this.icecandidates };

        // Create QR Code
        let url = await QRCode.toDataURL(JSON.stringify(data)).catch(console.error);
        this.setState({ qrcode: url });
    }

    async _scanDoneHandler(data) {
        let obj = JSON.parse(data);

        // Setting remote description
        await this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(obj.answer)).catch(this.handleError);

        // Adding ice candidates from remote
        obj.candidates.forEach((candidate) => {
            this.localPeerConnection.addIceCandidate(candidate).catch(this.handleError);
        });
    }

    _abortHandler() {
        this.props.onAbort();
    }

    render() {
        return (
            <div className="ticket-reader-dialog">
                <div className="ticket-reader-background-box"></div>
                <div className="ticket-reader-dialog-center">
                    <div className="ticket-reader-dialog-box">
                        <div className="ticket-reader-db-header">
                            <h1>Remote Ticket Reader Hinzufügen</h1>
                            <Button className="abort" onClick={this._abortHandler}>X</Button>
                        </div>
                        {this.state.step === 0 &&
                            <div>
                                <div className="ticket-reader-qrcode">
                                    {!this.state.qrcode && <div className="loader">Loading...</div>}
                                    {this.state.qrcode && <img src={this.state.qrcode} alt="Ein QR-Code sollte hier angezeigt werden." />}
                                </div>
                                <div className="ticket-reader-description">
                                    <p>Bitte mit dem Zielgerät scannen</p>
                                </div>
                                <div className="ticket-reader-action">
                                    <Button onClick={() => { this.setState({ step: 1 }); }} label="Weiter"></Button>
                                </div>
                            </div>
                        }
                        {this.state.step === 1 &&
                            <div>
                                <div className="ticket-reader-scanner">
                                    <QRScanner onDone={this._scanDoneHandler} label="Scanvorgang starten"></QRScanner>
                                </div>
                                <div className="ticket-reader-description">
                                    <p>Bitte nun den Code des Zielgeräts scannen</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

}

/**
 * Represents a ticket reader on a remote device.
 * Use this class to connect to a TicketReaderManager.
 */
// eslint-disable-next-line
export class TicketReader extends React.Component {

    constructor(props) {
        super(props);
        this.state = { step: 0 };
        this._iceCandidatesHandler = this._iceCandidatesHandler.bind(this);
        this._dataChannelOpenHandler = this._dataChannelOpenHandler.bind(this);
        this._receiveChannelHandler = this._receiveChannelHandler.bind(this);
        this._generateAnswerCode = this._generateAnswerCode.bind(this);
        this._abortHandler = this._abortHandler.bind(this);
        this._scanDoneHandler = this._scanDoneHandler.bind(this);
        this._initConnection();
    }

    _initConnection() {
        const servers = null;

        this.icecandidates = [];

        this.localPeerConnection = new RTCPeerConnection(servers);
        this.localPeerConnection.addEventListener('icecandidate', this._iceCandidatesHandler);
        this.localPeerConnection.addEventListener('iceconnectionstatechange', this._connectionChangeHandler);
        this.localPeerConnection.addEventListener('datachannel', this._receiveChannelHandler);
    }

    _iceCandidatesHandler(event) {
        if (this.icecandidates.length <= 1) { // Constrain the candidates to max. 2
            this.icecandidates.push(event.candidate);
        }
        if (this.offer && !this.qrcode) {
            setTimeout(this._generateAnswerCode, 100); // Set a delay to collect some more icecandidates
        }
    }

    _connectionChangeHandler(event) {
        console.log(event);
    }

    _dataChannelOpenHandler(event) {
        console.log(event);
        this.props.onReady();
        this.dataChannel.send('Hallo Master!');
    }

    _dataChannelClosedHandler(event) {
        console.log(event);
    }

    _messageHandler(event) {
        alert(event.data);
    }

    _receiveChannelHandler(event) {
        this.dataChannel = event.channel;
        this.dataChannel.addEventListener('message', this.onMessage);
        this.dataChannel.addEventListener('open', this.onDataChannelOpen);
        this.dataChannel.addEventListener('close', this.onDataChannelClosed);
    }

    _readTicketRemote() {

    }

    _obliterateTicketRemote() {

    }

    async _generateAnswerCode() {
        let data = { answer: this.answer, candidates: this.icecandidates };

        // Create QR Code
        let url = await QRCode.toDataURL(JSON.stringify(data)).catch(console.error);
        this.setState({ qrcode: url });
    }

    async _scanDoneHandler(data) {
        let obj = JSON.parse(data);

        // Setting remote description
        await this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(obj.offer)).catch(console.error);

        // Adding ice candidates from remote
        obj.candidates.forEach((candidate) => {
            this.localPeerConnection.addIceCandidate(candidate).catch(console.error);
        });

        // Creating answer
        this.answer = await this.localPeerConnection.createAnswer().catch(console.error);

        await this.localPeerConnection.setLocalDescription(this.answer).catch(console.error);

        this.setState({ step: 1 });
    }

    _abortHandler() {
        this.props.onAbort();
    }

    render() {
        return (
            <div className="ticket-reader-dialog">
                <div className="ticket-reader-background-box"></div>
                <div className="ticket-reader-dialog-center">
                    <div className="ticket-reader-dialog-box">
                        <div className="ticket-reader-db-header">
                            <h1>Als Ticket Reader verbinden</h1>
                            <Button className="abort" onClick={this._abortHandler}>X</Button>
                        </div>
                        {this.state.step === 0 &&
                            <div>
                                <div className="ticket-reader-scanner">
                                    <QRScanner onDone={this._scanDoneHandler} label="Scanvorgang starten"></QRScanner>
                                </div>
                                <div className="ticket-reader-description">
                                    <p>Bitte den Code des Initiators scannen</p>
                                </div>
                            </div>
                        }
                        {this.state.step === 1 &&
                            <div>
                                <div className="ticket-reader-qrcode">
                                    {!this.state.qrcode && <div className="loader">Loading...</div>}
                                    {this.state.qrcode && <img src={this.state.qrcode} alt="Ein QR-Code sollte hier angezeigt werden." />}
                                </div>
                                <div className="ticket-reader-description">
                                    <p>Bitte nun mit dem Initiator Gerät scannen</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

}

/**
 * The main unit (master) to which instances of TicketReader can connect.
 */
export class TicketReaderManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = { remoteTicketReader: [] };
        this.connectRemoteTicketReader = this.connectRemoteTicketReader.bind(this);
    }

    /**
     * Initiates the RTC Peer connection to an instance of TicketReader on another device.
     */
    connectRemoteTicketReader() {
        let remoteTicketReader = <RemoteTicketReader
            onAbort={() => { this.setState({ connect: null }); }}
            onReady={() => { this.setState({ connect: null }); this.setState({remoteTicketReader: this.state.remoteTicketReader.push(remoteTicketReader)}); }}></RemoteTicketReader>;
        this.setState({ connect: remoteTicketReader });
    }

    disconnectRemoteTicketReader(remoteTicketReader) {

    }

    disconnectAll() {

    }

    render() {
        return (
            <Box className="TicketReaderManager" pad="medium">
                <p>
                    Derzeit sind {this.state.remoteTicketReader.length} Ticket Leser verbunden.
                </p>
                <Button onClick={this.connectRemoteTicketReader} label="Ticket Leser Hinzufügen"></Button>
                {this.state.connect}
            </Box>
        );
    }

}