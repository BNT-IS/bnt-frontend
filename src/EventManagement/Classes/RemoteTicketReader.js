// eslint-disable-next-line
import adapter from 'webrtc-adapter';

/**
 * Represents an object holder for diverse connectio objects to the ticket reader.
 */
class RemoteTicketReader {

    constructor() {
        // Binding "this" to the event handlers
        this.iceCandidatesHandler = this.iceCandidatesHandler.bind(this);
        this.dataChannelOpenHandler = this.dataChannelOpenHandler.bind(this);
        this.generateOfferCode = this.generateOfferCode.bind(this);
        this.dataChannelClosedHandler = this.dataChannelClosedHandler.bind(this);
        this.connectionChangeHandler = this.connectionChangeHandler.bind(this);
        this.setTicketReaderConfig = this.setTicketReaderConfig.bind(this);
        this.messageHandler = this.messageHandler.bind(this);

        // Defining a unique id for this instance
        this.uuid = this.createUUID();

        // Initializing empty event listeners to prevent "undefined" errors

        /**
         * @public
         * This eventlistener is called when the 
         * ticket reader changed its connection state. Please implement externally.
         * @param {String} connectionState - State of the connection.
         */
        this.onConnectionChanged = function (connectionState) { };

        /**
         * @public
         * This eventlistener is called once when the 
         * ticket reader datachannel is ready to use after initiaization. Please implement externally.
         */
        this.onReady = function () { };

        /**
         * @public
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
         * @public
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
         * @public
         * This eventlistener requires identifier and the secret ingredient and a callback 
         * that needs to be called with true or false depending if successfully obliterated or not. 
         * Please implement externally.
         * @param {String} identifier - Identifier of the ticket.
         * @param {String} secretIngredient - Secret ingredient used for generating the identifier of the ticket.
         * @param {onObliterateTicketCallback} callback - Callback that should be called with a ticket Object.
         */
        this.onObliterateTicket = function (identifier, secretIngredient, callback) { };

        // Initializing the RTC connection
        this.initConnection();
    }

    /**
     * @private
     * Prepares RTCPeerConnection and datachannels for
     * the connection with a ticket reader client.
     */
    initConnection() {
        const servers = null;
        const dataConstraint = null;

        this.icecandidates = [];

        this.localPeerConnection = new RTCPeerConnection(servers);
        this.localPeerConnection.addEventListener('icecandidate', this.iceCandidatesHandler);

        this.localPeerConnection.addEventListener('connectionstatechange', this.connectionChangeHandler);

        this.dataChannel = this.localPeerConnection.createDataChannel('sendDataChannel', dataConstraint);
        this.dataChannel.addEventListener('message', this.messageHandler);
        this.dataChannel.addEventListener('open', this.dataChannelOpenHandler);
        this.dataChannel.addEventListener('close', this.dataChannelClosedHandler);

        this.createOffer();
    }

    /**
     * @private
     * Eventhandler for new icecandidates from the RTCPeerConnection.
     * Only for internal use.
     * @param {RTCPeerConnectionIceEvent} event 
     */
    iceCandidatesHandler(event) {
        this.icecandidates.push(event.candidate);
        if (this.offer && !this.qrcode) {
            setTimeout(this.generateOfferCode, 200); // Set a delay to collect some more icecandidates
        }
    }

    /**
     * @private
     * Eventhandler for changed connection states.
     * Only for internal use. For external event-listening, the "onConnectionChanged" property
     * should be implemented!
     * @param {Event} event 
     */
    connectionChangeHandler(event) {
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

    /**
     * @private
     * Eventhandler for the case when the datachannel is ready.
     * @param {Event} event 
     */
    dataChannelOpenHandler(event) {
        console.debug(event);
        this.onReady();
        this.dataChannel.send('Hallo Client!');
    }

    /**
     * @private
     * Eventhandler for the case when the datachannel is closed.
     * @param {Event} event 
     */
    dataChannelClosedHandler(event) {
        console.debug('Data Channel Closed', event);
    }

    /**
     * @private
     * Eventhandler for new incoming messages via the datachannel.
     * @param {Event} event 
     */
    messageHandler(event) {
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
               result: Any,
               error: String
           }
        */

        // Switching between different request types and contexts
        switch (msg.context) {
            case "ticketMirror":
                if (msg.method === "getTicket") {
                    this.onGetTicket(msg.params[0], (ticket, errorMsg) => {
                        let answerMsg = {
                            reqId: msg.reqId,
                            result: ticket,
                            error: errorMsg
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
                            result: success,
                            error: errorMsg
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

    /**
     * @private
     * Method to create unique id.
     */
    createUUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 & 0x8)).toString(16);
        });
        return uuid;
    }

    /**
     * @private
     * Method that creates a new connection configuration offer.
     */
    async createOffer() {
        this.offer = await this.localPeerConnection.createOffer().catch(console.error);
        await this.localPeerConnection.setLocalDescription(this.offer).catch(console.error);
    }

    /**
     * @private
     * Method to generate a complete configuration for the
     * ticketreader client.
     */
    async generateOfferCode() {
        let data = { offer: this.offer, candidates: this.icecandidates };
        this.onOffer(data);
    }

    /**
     * @typedef {Object} TicketReaderConfig
     * @property {RTCSessionDescriptionInit} answer
     * @property {RTCIceCandidate[]} candidates
     */

    /**
     * @public
     * Method to set the connection config received from the
     * ticketreader client.
     * @param {TicketReaderConfig} config 
     */
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