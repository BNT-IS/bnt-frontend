// eslint-disable-next-line
import adapter from 'webrtc-adapter';

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

        this.uuid = this._createUUID();

        // Initializing empty event listeners to prevent "undefined" errors

        /**
         * This eventlistener is called when the 
         * ticket reader changed its connection state. Please implement externally.
         * @param {String} connectionState - State of the connection.
         */
        this.onConnectionChanged = function (connectionState) { };

        /**
         * This eventlistener is called once when the 
         * ticket reader datachannel is ready to use after initiaization. Please implement externally.
         */
        this.onReady = function () { };

        /**
         * This eventlistener is called when the data 
         * for the connection offer is generated. Please implement externally.
         * @param {Object} config - The config.
         */
        this.onOffer = function (config) { };

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

        this.localPeerConnection.addEventListener('connectionstatechange', this._connectionChangeHandler);

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
        let connectionState = event.target.connectionState;

        switch (connectionState) {
            case "connected":
                // The connection has become fully connected
                break;
            case "disconnected":
                break;
            case "failed":
                // One or more transports has terminated unexpectedly or in an error
                break;
            case "closed":
                // The connection has been closed
                break;
            default:
                break;
        }

        this.onConnectionChanged(connectionState);

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
                            result: { ticket: ticket, errorMessage: errorMsg }
                        }
                        try {
                            this.dataChannel.send(JSON.stringify(answerMsg));
                        } catch (error) {
                            console.error(error);
                        }
                    });
                } else if (msg.method === "obliterateTicket") {
                    this.onObliterateTicket(msg.params[0], msg.params[1], (success, errorMsg) => {
                        let answerMsg = {
                            reqId: msg.reqId,
                            result: { success: success, errorMessage: errorMsg }
                        }
                        try {
                            this.dataChannel.send(JSON.stringify(answerMsg));
                        } catch (error) {
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
        this.onOffer(data);
    }

    async setTicketReaderConfig(config) {
        // Setting remote description
        await this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(config.answer)).catch(this.handleError);

        // Adding ice candidates from remote
        config.candidates.forEach((candidate) => {
            this.localPeerConnection.addIceCandidate(candidate).catch(this.handleError);
        });
    }

}
export default RemoteTicketReader;