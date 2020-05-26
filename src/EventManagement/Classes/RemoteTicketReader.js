// eslint-disable-next-line
import adapter from 'webrtc-adapter';
import QRCode from 'qrcode';

/**
 * Represents an object holder for diverse connectio objects to the ticket reader.
 */
class RemoteTicketReader {

    constructor() {
        // Binding "this" to the event handlers
        this._iceCandidatesHandler = this._iceCandidatesHandler.bind(this);
        this._dataChannelOpenHandler = this._dataChannelOpenHandler.bind(this);
        this._generateOfferCode = this._generateOfferCode.bind(this);
        this._dataChannelClosedHandler = this._dataChannelClosedHandler.bind(this);
        this._connectionChangeHandler = this._connectionChangeHandler.bind(this);
        this.setTicketReaderConfig = this.setTicketReaderConfig.bind(this);

        // Initializing empty event listeners to prevent "undefined" errors
        this.onDisconnected = function () { };
        this.onReady = function () { };
        this.onGetTicket = function () { };
        this.onObliterateTicket = function () { };
        this.onOfferCode = function () { };

        // Initializing the RTC connection
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
        var msg;
        try {
            msg = JSON.parse(event.data);
        } catch (e) {
            console.error(e);
            console.debug("Message was:", event.data);
            return;
        }

        /** Messages look like this...
         * msg = {
                reqId: Unique String,
                context: String,
                method: String,
                params: [Any]
            }
         */

        switch (msg.context) {
            case "ticketMirror":
                if (msg.method === "getTicket") {
                    this.onGetTicket(msg.params);
                } else if (msg.method === "obliterateTicket") {
                    this.onObliterateTicket(msg.params);
                }
                break;
            default:
                break;
        }
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
export default RemoteTicketReader;