// eslint-disable-next-line
import adapter from 'webrtc-adapter';
import QRCode from 'qrcode';
import pako from 'pako';

/**
 * Represents a ticket reader on a remote device.
 * Use this class to connect to a TicketReaderManager.
 */
class TicketReader {

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
        this.icecandidates.push(event.candidate);
        if (this.answer && !this.qrcode) {
            setTimeout(this._generateAnswerCode, 200); // Set a delay to collect some more icecandidates
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
        alert(event.data);
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
                type: "Request",
                reqId: reqId,
                context: "ticketMirror",
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
                type: "Request",
                reqId: reqId,
                context: "ticketMirror",
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

        // Compress data
        let binaryString = pako.deflate(JSON.stringify(data), { level: 9, to: "string" });

        // Create QR Code
        let url = await QRCode.toDataURL(binaryString).catch(console.error);
        this.qrcode = url;
        this.onAnswerCode(url);
    }

    async setMasterConfig(binaryString) {
        let obj = JSON.parse(pako.inflate(binaryString, { to: 'string' }));

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

export default TicketReader;