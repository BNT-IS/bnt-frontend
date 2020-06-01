// eslint-disable-next-line
import adapter from 'webrtc-adapter';
import QRCode from 'qrcode';
import pako from 'pako';

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
        this._messageHandler = this._messageHandler.bind(this);

        // Initializing empty event listeners to prevent "undefined" errors

        /**
         * This eventlistener is called when the 
         * ticket reader is disconnected. Please implement externally.
         */
        this.onDisconnected = function () { };

        /**
         * This eventlistener is called when the 
         * ticket reader datachannel is ready to use. Please implement externally.
         */
        this.onReady = function () { };

        /**
         * This eventlistener is called when the QR-Code 
         * for the connection offer is generated and accessible via url. Please implement externally.
         * @param {String} url - The URL of the QR-Code.
         */
        this.onOfferCode = function (url) { };

        /**
         * This callback is for onGetTicket eventlistener.
         * @callback onGetTicketCallback
         * @param {Object} ticket - The ticket as JS Object.
         * @param {String} [errorMessage] - In case of ticket = null an error a message should be provided.
         */

        /**
         * This eventlistener requires an identifier and a callback 
         * that needs to be called with the ticket as JS Object.
         * Please implement externally.
         * @param {String} identifier - Identifier of the ticket.
         * @param {onGetTicketCallback} callback - Callback that should be called with a ticket Object.
         */
        this.onGetTicket = function (identifier, callback) { };

        /**
         * This callback is for onObliterateTicket eventlistener.
         * @callback onObliterateTicketCallback
         * @param {Boolean} success - Whether the obliterating was successful or not.
         * @param {String} [errorMessage] - In case of success = false, an error message should be provided.
         */

        /**
         * This eventlistener requires identifier and signature and a callback 
         * that needs to be called with true or false depending if successfully obliterated or not. 
         * Please implement externally.
         * @param {String} identifier - Identifier of the ticket.
         * @param {String} signature - Signature used for generating the identifier of the ticket.
         * @param {onObliterateTicketCallback} callback - Callback that should be called with a ticket Object.
         */
        this.onObliterateTicket = function (identifier, signature, callback) { };

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
        this.icecandidates.push(event.candidate);
        if (this.offer && !this.qrcode) {
            setTimeout(this._generateOfferCode, 200); // Set a delay to collect some more icecandidates
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
        console.debug("Message received:", event.data);
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
                type: "Request",     
                reqId: Unique String,
                context: String,
                method: String,
                params: [Any]
            }
         */

        /** Answer Messages should look like this...
        * msg = {
               type: "Answer",
               reqId: Unique String,
               result: Any
           }
        */

        // Switching between different request types and contexts
        switch (msg.context) {
            case "ticketMirror":
                if (msg.method === "getTicket") {
                    this.onGetTicket(msg.params[0], (ticket, errorMsg) => {
                        let answerMsg = {
                            reqId: msg.reqId,
                            result: { ticket: ticket, errorMessage: errorMsg}
                        }
                        try{
                            this.dataChannel.send(JSON.stringify(answerMsg));
                        }catch(error){
                            console.error(error);
                        }
                    });
                } else if (msg.method === "obliterateTicket") {
                    this.onObliterateTicket(msg.params[0], msg.params[1], (success, errorMsg) => {
                        let answerMsg = {
                            reqId: msg.reqId,
                            result: { success: success, errorMessage: errorMsg }
                        }
                        try{
                            this.dataChannel.send(JSON.stringify(answerMsg));
                        }catch(error){
                            console.error(error);
                        }
                    });
                }
                break;
            default:
                break;
        }
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

    async _createOffer() {
        this.offer = await this.localPeerConnection.createOffer().catch(console.error);
        await this.localPeerConnection.setLocalDescription(this.offer).catch(console.error);
    }

    async _generateOfferCode() {
        let data = { offer: this.offer, candidates: this.icecandidates };

        // Compress data
        let binaryString = pako.deflate(JSON.stringify(data), { level: 9, to: "string" });

        // Create QR Code
        let url = await QRCode.toDataURL(binaryString).catch(console.error);
        this.qrcode = url;
        this.onOfferCode(url);
    }

    async setTicketReaderConfig(config) {
        let obj = JSON.parse(pako.inflate(binaryString, { to: 'string' }));

        // Setting remote description
        await this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(obj.answer)).catch(this.handleError);

        // Adding ice candidates from remote
        obj.candidates.forEach((candidate) => {
            this.localPeerConnection.addIceCandidate(candidate).catch(this.handleError);
        });
    }

}
export default RemoteTicketReader;