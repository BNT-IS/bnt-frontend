import Web3 from 'web3';
import Config from '../../config';

/**
 * Class for basic operations and preparations for the local caching of ticket data
 */
class LocalTicketMirror {

    constructor() {

        // Binding "this" to methods that get called from other contexts
        this._createDB = this._createDB.bind(this);
        this.saveTicketMirror = this.saveTicketMirror.bind(this);
        this.getTicketList = this.getTicketList.bind(this);

        // Check if Indexed DB (IDB) technology is supported in the current browser
        if (!window.indexedDB) {
            throw Error("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }

        // Collection for DB Requests that happen before initialization of the DB connection instance (this.db)
        this.waitingForIDBReadyQueue = [];

        // Finally initializing DB connection
        this._initDB();

        /**
         * @public
         * This eventlistener is called when the 
         * ticket list were updated. Please implement externally.
         * @param {Array} tickets - New ticket list.
         */
        this.onTicketListChanged = function (tickets) { };
    }

    /**
     * Initializes connection to IDB and saves the connection
     * instance to "this.db"
     */
    _initDB() {
        console.debug('Initializing IDB Connection');
        var request = window.indexedDB.open(Config.IDB_NAME, 1);

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
        var objectStore = this.db.createObjectStore("tickets", { keyPath: "identifier" });
        objectStore.createIndex("forename", "forename", { unique: false });
        objectStore.createIndex("surname", "surname", { unique: false });
        objectStore.createIndex("ticketType", "ticketType", { unique: false });
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
    async saveTicketMirror(tickets) {
        try {
            var db = await this._getIDB();

            var objectStore = db.transaction("tickets", "readwrite").objectStore("tickets");
            objectStore.clear();

            tickets.forEach((ticket) => {
                objectStore.add(ticket);
            });

            this.onTicketListChanged();
        } catch (error) {
            console.error(error);
            alert('Es ist ein Fehler bei der Indexed DB aufgetreten');
        }
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
     * The secretIngredient of the owner is checked to validate the persons identity.
     * @param {String} identifier - Unique identifier of the ticket
     * @param {String} secretIngredient - Specific secretIngredient of the user that was used to generate the identifer
     * @returns {Promise} Returns a promise that is resolved with null or rejected with an error message
     */
    obliterateTicket(identifier, secretIngredient) {
        return new Promise(async (resolve, reject) => {
            var db = await this._getIDB().catch(console.error);
            if (!db) return reject();
            var objectStore = db.transaction("tickets", "readwrite").objectStore("tickets");
            var request = objectStore.get(identifier);
            request.onerror = reject;
            request.onsuccess = (event) => {
                // Get the old value that we want to update
                var ticket = event.target.result;
                if (!ticket) return reject("Das Ticket existiert nicht.");

                // Check secretIngredient and identifier hash
                var valuesForHash = secretIngredient + ticket.forename + ticket.surname + ticket.ticketType;
                var checkSum = Web3.utils.sha3(valuesForHash);

                if (checkSum !== identifier) return reject("Die Identität des Tickets konnte nicht verifiziert werden.");

                // Check validity and if it was not used before
                if (!ticket.isValid) return reject("Das Ticket ist nicht gültig.");
                if (ticket.isUsed) return reject("Das Ticket wurde breits entwertet.");

                ticket.isUsed = true;

                // Put this updated object back into the database.
                var requestUpdate = objectStore.put(ticket);
                requestUpdate.onerror = reject;
                requestUpdate.onsuccess = async (event) => {
                    resolve(event);
                    this.onTicketListChanged();
                };
            };
        });
    }

}

export default LocalTicketMirror;