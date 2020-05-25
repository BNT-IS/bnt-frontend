import React from 'react';
import { Box, Button } from 'grommet';
import QRScanner from '../Utilities/QRScanner';
import Dialog from '../Utilities/Dialog';

// eslint-disable-next-line
import adapter from 'webrtc-adapter';
import QRCode from 'qrcode';

/**
 * Represents an object holder for diverse connectio objects to the ticket reader.
 */
class RemoteTicketReader {

    constructor() {
        this._iceCandidatesHandler = this._iceCandidatesHandler.bind(this);
        this._dataChannelOpenHandler = this._dataChannelOpenHandler.bind(this);
        this._generateOfferCode = this._generateOfferCode.bind(this);
        this._dataChannelClosedHandler = this._dataChannelClosedHandler.bind(this);
        this._connectionChangeHandler = this._connectionChangeHandler.bind(this);
        this.setTicketReaderConfig = this.setTicketReaderConfig.bind(this);
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
        console.debug(event);
        if (event.target.iceConnectionState === "disconnected") {
            this.onDisconnected();
        }
    }

    _dataChannelOpenHandler(event) {
        console.debug(event);
        this.onReady();
        this.dataChannel.send('Hallo Client!');
    }

    _dataChannelClosedHandler(event) {
        console.debug('Data Channel Closed', event);
    }

    _messageHandler(event) {
        alert(event.data);
    }

    async _createOffer() {
        this.offer = await this.localPeerConnection.createOffer().catch(console.error);
        await this.localPeerConnection.setLocalDescription(this.offer).catch(console.error);
    }

    async _generateOfferCode() {
        let data = { offer: this.offer, candidates: this.icecandidates };

        // Create QR Code
        let url = await QRCode.toDataURL(JSON.stringify(data)).catch(console.error);
        this.onOfferCode(url);
    }

    async setTicketReaderConfig(config) {
        let obj = JSON.parse(config);

        // Setting remote description
        await this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(obj.answer)).catch(this.handleError);

        // Adding ice candidates from remote
        obj.candidates.forEach((candidate) => {
            this.localPeerConnection.addIceCandidate(candidate).catch(this.handleError);
        });
    }

}

/**
 * Represents a ticket reader on a remote device.
 * Use this class to connect to a TicketReaderManager.
 */
// eslint-disable-next-line
export class TicketReader {

    constructor() {
        this.requestMap = new Map();
        this._iceCandidatesHandler = this._iceCandidatesHandler.bind(this);
        this._dataChannelOpenHandler = this._dataChannelOpenHandler.bind(this);
        this._receiveChannelHandler = this._receiveChannelHandler.bind(this);
        this._generateAnswerCode = this._generateAnswerCode.bind(this);
        this.setMasterConfig = this.setMasterConfig.bind(this);
        this._dataChannelClosedHandler = this._dataChannelClosedHandler.bind(this);
        this._connectionChangeHandler = this._connectionChangeHandler.bind(this);
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
        if (this.answer && !this.qrcode) {
            setTimeout(this._generateAnswerCode, 100); // Set a delay to collect some more icecandidates
        }
    }

    _connectionChangeHandler(event) {
        console.debug(event);
        if (event.target.iceConnectionState === "disconnected") {
            this.onDisconnected();
        }
    }

    _dataChannelOpenHandler(event) {
        console.debug(event);
        this.onReady();
        this.dataChannel.send('Hallo Master!');
    }

    _dataChannelClosedHandler(event) {
        console.debug(event);
    }

    _messageHandler(event) {
        console.debug(event.data);
    }

    _receiveChannelHandler(event) {
        this.dataChannel = event.channel;
        this.dataChannel.addEventListener('message', this._messageHandler);
        this.dataChannel.addEventListener('open', this._dataChannelOpenHandler);
        this.dataChannel.addEventListener('close', this._dataChannelClosedHandler);
    }

    _createUUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 & 0x8)).toString(16);
        });
        return uuid;
    }

    readTicketRemote(identifier) {
        return new Promise((resolve, reject) => {
            let reqId = this._createUUID();
            this.requestMap.set(reqId, { resolve: resolve, reject: reject });
            const msg = {
                reqId: reqId,
                method: "getTicket",
                params: [identifier]
            }
            try{
                this.dataChannel.send(JSON.stringify(msg));
            }catch(e){
                reject(e);
            }
        });
    }

    obliterateTicketRemote(identifier, signature) {
        return new Promise((resolve, reject) => {
            let reqId = this._createUUID();
            this.requestMap.set(reqId, { resolve: resolve, reject: reject });
            const msg = {
                reqId: reqId,
                method: "obliterateTicket",
                params: [identifier, signature]
            }
            try{
                this.dataChannel.send(JSON.stringify(msg));
            }catch(e){
                reject(e);
            }
        });
    }

    async _generateAnswerCode() {
        let data = { answer: this.answer, candidates: this.icecandidates };

        // Create QR Code
        let url = await QRCode.toDataURL(JSON.stringify(data)).catch(console.error);
        this.onAnswerCode(url);
    }

    async setMasterConfig(config) {
        let obj = JSON.parse(config);

        // Setting remote description
        await this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(obj.offer)).catch(console.error);

        // Adding ice candidates from remote
        obj.candidates.forEach((candidate) => {
            this.localPeerConnection.addIceCandidate(candidate).catch(console.error);
        });

        // Creating answer
        this.answer = await this.localPeerConnection.createAnswer().catch(console.error);

        await this.localPeerConnection.setLocalDescription(this.answer).catch(console.error);
    }

}

/**
 * The main unit (master) to which instances of TicketReader can connect.
 */
export class TicketReaderManager extends React.Component {

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