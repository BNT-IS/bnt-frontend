/**
 * Class for basic operations and preparations for the local caching of ticket data
 */
export class LocalTicketMirror {

    constructor() {
        this._createDB = this._createDB.bind(this);
        this.dumpTicketMirror = this.dumpTicketMirror.bind(this);
        if (!window.indexedDB) {
            throw Error("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }
        this._initDB();
    }

    _initDB() {
        var request = window.indexedDB.open("TicketMirror", 1);

        request.addEventListener('upgradeneeded', this._createDB);
        request.addEventListener('success', (ev) => {
            this.db = ev.target.result;
        });
        request.addEventListener('error', (ev) => {
            console.error("Database error: " + ev.target.errorCode);
        });
    }

    _createDB(event) {
        this.db = event.target.result;

        // Create an objectStore for this database
        var objectStore = this.db.createObjectStore("tickets", { keyPath: "identifier" });
        objectStore.createIndex("isValid", "isValid", { unique: false });
        objectStore.createIndex("isUsed", "isUsed", { unique: false });

        objectStore.transaction.addEventListener('complete', this.dumpTicketMirror);
    }

    dumpTicketMirror() {

        var objectStore = this.db.transaction("tickets", "readwrite").objectStore("tickets");

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
     * Fetches a ticket by its identifier
     * @param {String} identifier - Unique identifier of the ticket
     * @returns {Ticket} Returns a promise that resolves as the ticket
     */
    getTicket(identifier) {
        return new Promise((resolve, reject) => {
            var objectStore = this.db.transaction("tickets", "readonly").objectStore("tickets");
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
        return new Promise((resolve, reject) => {
            var objectStore = this.db.transaction("tickets", "readwrite").objectStore("tickets");
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