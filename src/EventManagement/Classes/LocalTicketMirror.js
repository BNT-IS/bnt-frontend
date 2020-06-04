/**
 * Class for basic operations and preparations for the local caching of ticket data
 */
class LocalTicketMirror {

    constructor() {

        // Binding "this" to methods that get called from other contexts
        this._createDB = this._createDB.bind(this);
        this.dumpTicketMirror = this.dumpTicketMirror.bind(this);
        this.getTicketList = this.getTicketList.bind(this);

        // Check if Indexed DB (IDB) technology is supported in the current browser
        if (!window.indexedDB) {
            throw Error("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }

        // Collection for DB Requests that happen before initialization of the DB connection instance (this.db)
        this.waitingForIDBReadyQueue = [];

        // Finally initializing DB connection
        this._initDB();
    }

    /**
     * Initializes connection to IDB and saves the connection
     * instance to "this.db"
     */
    _initDB() {
        console.debug('Initializing IDB Connection');
        var request = window.indexedDB.open("TicketMirror", 1);

        request.addEventListener('upgradeneeded', this._createDB);
        request.addEventListener('success', (ev) => {
            console.debug('IDB Connection established');
            this.db = ev.target.result;
            this.waitingForIDBReadyQueue.forEach((resolve) => {
                resolve(this.db);
            });
        });
        request.addEventListener('error', (ev) => {
            console.error("Database error: " + ev.target.errorCode);
        });
    }

    /**
     * Eventhandler for cases where the IDB has to be created / initialized
     * Only for internal use.
     * @param {Event} event 
     */
    _createDB(event) {
        this.db = event.target.result;

        // Create an objectStore for this database
        this.db.createObjectStore("tickets", { keyPath: "identifier" });
    }

    /**
     * Getter for the IDB Connection. Only for internal use.
     * @returns Returns a Promis that is resolved with a IDBConnection when it is ready.
     */
    _getIDB() {
        return new Promise((resolve) => {
            if (this.db) {
                resolve(this.db);
            } else {
                this.waitingForIDBReadyQueue.push(resolve);
            }
        });
    }

    /**
     * Method that writes data to the IDB datastore "tickets"
     */
    async dumpTicketMirror() {
        var db = await this._getIDB().catch(console.error);
        if (!db) return;

        var objectStore = db.transaction("tickets", "readwrite").objectStore("tickets");

        // TODO: Fetch real data from the blockchain when online
        const dummyData = [{
            "identifier": "ca6c9409-0ec9-42fb-9ca7-d42a74642d7e",
            "isValid": true,
            "isUsed": false,
            "ticketType": "Parken"
        }, {
            "identifier": "cea4b540-63a4-4abd-9a9a-499bb3879b8c",
            "isValid": false,
            "isUsed": true,
            "ticketType": "Begleitperson"
        }, {
            "identifier": "2537f4c1-2bfa-416f-9098-9b61fe4bb59d",
            "isValid": true,
            "isUsed": false,
            "ticketType": "Begleitperson"
        }, {
            "identifier": "c3573a44-f9e8-4772-bf80-57d1d07239c8",
            "isValid": true,
            "isUsed": true,
            "ticketType": "Begleitperson"
        }, {
            "identifier": "5506d14d-8090-411a-897c-3f6c898ec8d2",
            "isValid": true,
            "isUsed": true,
            "ticketType": "Begleitperson"
        }]

        dummyData.forEach((item) => {
            objectStore.add(item);
        });

    }

    /**
     * A local representation of a ticket joined out of the private db and the smart contract
     * @typedef {Object} Ticket
     * @property {String} identifier
     * @property {Boolean} isValid
     * @property {Boolean} isUsed
     * @property {String} ticketType 
     */

    /**
     * For frontend purposes to get all tickets out of the db.
     * @returns {Ticket[]} Returns an array of tickets
     */
    getTicketList() {
        return new Promise(async (resolve, reject) => {
            var db = await this._getIDB().catch(console.error);
            if (!db) return reject();
            var objectStore = db.transaction("tickets", "readonly").objectStore("tickets");
            var request = objectStore.getAll();
            request.onerror = reject;
            request.onsuccess = function (event) {
                var tickets = event.target.result;
                return resolve(tickets);
            };
        });
    }

    /**
     * Fetches a ticket by its identifier
     * @param {String} identifier - Unique identifier of the ticket
     * @returns {Ticket} Returns a promise that resolves as the ticket
     */
    getTicket(identifier) {
        return new Promise(async (resolve, reject) => {
            var db = await this._getIDB().catch(console.error);
            if (!db) return reject();
            var objectStore = db.transaction("tickets", "readonly").objectStore("tickets");
            var request = objectStore.get(identifier);
            request.onerror = reject;
            request.onsuccess = function (event) {
                var ticket = event.target.result;
                if (!ticket) return reject("Ticket does not exist.");
                return resolve(ticket);
            };
        });
    }

    /**
     * Obliterates a ticket selected by its unique identifer.
     * The signature of the owner is checked to validate the persons identity.
     * @param {String} identifier - Unique identifier of the ticket
     * @param {String} signature - Specific signature of the owner that was used to generate the identifer
     * @returns {Promise} Returns a promise that is resolved with null or rejected with an error message
     */
    obliterateTicket(identifier, signature) {
        return new Promise(async (resolve, reject) => {
            var db = await this._getIDB().catch(console.error);
            if (!db) return reject();
            var objectStore = db.transaction("tickets", "readwrite").objectStore("tickets");
            var request = objectStore.get(identifier);
            request.onerror = reject;
            request.onsuccess = (event) => {
                // Get the old value that we want to update
                var ticket = event.target.result;
                if (!ticket) return reject("Ticket does not exist.");

                // TODO: Check signature and identifier hash

                // Check validity and if it was not used before
                if (!ticket.isValid) return reject("Ticket is not valid.");
                if (ticket.isUsed) return reject("Ticket was already used.");

                ticket.isUsed = true;

                // Put this updated object back into the database.
                var requestUpdate = objectStore.put(ticket);
                requestUpdate.onerror = reject;
                requestUpdate.onsuccess = resolve;
            };
        });
    }

}

export default LocalTicketMirror;