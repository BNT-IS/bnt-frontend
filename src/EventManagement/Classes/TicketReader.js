// eslint-disable-next-line
import adapter from 'webrtc-adapter';

/**
 * Represents a ticket reader on a remote device.
 * Use this class to connect to a RemoteTicketReader.
 */
class TicketReader {

    constructor() {
        this._iceCandidatesHandler = this._iceCandidatesHandler.bind(this);
        this._dataChannelOpenHandler = this._dataChannelOpenHandler.bind(this);
        this._receiveChannelHandler = this._receiveChannelHandler.bind(this);
        this._dataChannelClosedHandler = this._dataChannelClosedHandler.bind(this);
        this._connectionChangeHandler = this._connectionChangeHandler.bind(this);
        this._generateAnswer = this._generateAnswer.bind(this);

        // Map for requests sent via datachannel. Usage is: uuid =>  { resolve: resolve, reject: reject }
        this.requestMap = new Map();

        // Collection of all local icecandidates
        this.icecandidates = [];

        // Collection for all icecandidates that the master will provide
        this.remoteICECandidates = [];

        /**
         * This eventlistener is called when the 
         * ticket reader changed its connection state. Please implement externally.
         * @param {String} connectionState - State of the connection.
         */
        this.onConnectionChanged = function (connectionState) { };

        // Finally prepare connection
        this._initConnection();
    }

    /**
     * Method that initializes the peer connection.
     */
    async _initConnection() {
        const servers = null;

        this.localPeerConnection = new RTCPeerConnection(servers);
        this.localPeerConnection.addEventListener('icecandidate', this._iceCandidatesHandler);
        this.localPeerConnection.addEventListener('connectionstatechange', this._connectionChangeHandler);
        this.localPeerConnection.addEventListener('datachannel', this._receiveChannelHandler);
    }

    _iceCandidatesHandler(event) {
        this.icecandidates.push(event.candidate);
        if (this.answer && !this.qrcode) {
            setTimeout(this._generateAnswer, 200); // Set a delay to collect some more icecandidates
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
            try {
                this.dataChannel.send(JSON.stringify(msg));
            } catch (e) {
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
            try {
                this.dataChannel.send(JSON.stringify(msg));
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Method to set the config received from the master.
     * @param {Object} config - A JS Object containing the offer and ice candidates from the master. 
     */
    async setMasterConfig(config) {
        // Setting remote description
        await this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(config.offer)).catch(console.error);

        // Adding ice candidates from remote
        config.candidates.forEach((candidate) => {
            this.localPeerConnection.addIceCandidate(candidate).catch(console.error);
            this.remoteICECandidates.push(candidate);
        });

        // Creating answer
        this.answer = await this.localPeerConnection.createAnswer().catch(console.error);
        await this.localPeerConnection.setLocalDescription(this.answer).catch(console.error);
    }

    _generateAnswer(){
        let data = { answer: this.answer, candidates: this.icecandidates };
        this.onAnswer(data);
    }

    /**
     * Dumps all settings to JSON. Use this method to restore a broken session.
     */
    toJSON() {
        let lstore = {
            localDescription: this.localPeerConnection.currentLocalDescription,
            remoteDescription: this.localPeerConnection.currentRemoteDescription,
            candidates: this.remoteICECandidates
        }
        return JSON.stringify(lstore);
    }

}

export default TicketReader;