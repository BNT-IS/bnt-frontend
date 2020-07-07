import React from 'react';
import { Box, Button, Text, DataTable } from 'grommet';
import Config from '../../config';
import './ShopManagement.css';
import ShopManagementConfMaxTickets from './ShopManagementConfMaxTickets';
import ShopManagementSalesStatistics from './ShopManagementSalesStatistics';
import ShopManagementViewBookings from './ShopManagementViewBookings';
import ShopManagementManageSalesStatus from './ShopManagementManageSalesStatus';
import ShopManagamentAbsolventenListe from './ShopManagamentAbsolventenListe';
import ShopManagementPaymentOptions from './ShopManagementPaymentOptions';
import { Switch, Route } from "react-router-dom";
import UserContext from '../../AppContexts/UserContext';
import ShopManagementManageOTPS from './ShopManagementManageOTPS'
import ShopManagementViewOTPs from './ShopManagementViewOTPs'

class DataQuickViewMaxTickets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.callShopManagamentConfTickets = this.callShopManagamentConfTickets.bind(this);
    }

    //Switch to Component ConfMaxTickets
    callShopManagamentConfTickets() {
        window.location.assign("#/eventmgmt/shop/ConfMaxTickets")
    }

    render() {
        return (
            <Box name="purchaseableTicketsPerPerson" className="quickViewOuterBox" >
                <Text>Ticketanzahl die ein Absolvent erwerben kann:</Text>
                <Box className="platzhalter" ></Box>
                <DataTable className="quickViewDatatables"
                    columns={[
                        {
                            property: 'Tickettype',
                            header: <Text weight="bold">Tickettyp</Text>,
                            primary: true,
                        },
                        {
                            property: 'Anzahl',
                            header: <Text weight="bold">freigebene Anzahl</Text>,
                        },
                    ]}
                    data={this.props.maxTicketmenge}
                />
                <Box className="platzhalter" ></Box>
                <Box className="ButtonBox">
                    <Button className="buttonInDash" label="Ticketanzahl konfigurieren" onClick={this.callShopManagamentConfTickets}></Button>
                </Box>
            </Box>
        )
    }
}

class DataQuickViewPayment extends React.Component {
    //Gibt einen Schnellüberblick über die eingestellten Zahlungsmethoden und deren Status
    constructor(props) {
        super(props);
        this.state = {};
    }

    //Leitet den User zur Konfiguration der Zahlungmethoden weiter
    callConfiguratePaymentMethods() {
        window.location.assign("#/eventmgmt/shop/paymentOptions")
    }

    componentDidMount() {
        //Ruft beim Laden der Komponente den Aktuellen Status der Bank- und PayPal-Verbindung ab
        this.props.getBankStatus();
        this.props.getPayPalStatus();
    }


    render() {
        //Stellt den Schnellüberblick für die Zahlungsmethoden im Browser dar
        var bezahl = [];
        if (this.props.bankStatus) { bezahl.push({ BezahlOption: "Banküberweisung", Status: "Aktiv" }) };
        if (!this.props.bankStatus) { bezahl.push({ BezahlOption: "Banküberweisung", Status: "Deaktiviert" }) };
        if (this.props.payPalStatus) { bezahl.push({ BezahlOption: "PayPal", Status: "Aktiv" }) };
        if (!this.props.payPalStatus) { bezahl.push({ BezahlOption: "PayPal", Status: "Deaktiviert" }) };

        return (
            <Box name="paymentOptions" className="quickViewOuterBox">
                <Text>Übersicht der konfigurierten Bezahloptionen:</Text>
                <Box className="platzhalter" ></Box>
                <DataTable className="quickViewDatatables"
                    columns={[
                        {
                            property: 'BezahlOption',
                            header: <Text weight="bold">Bezahloption</Text>,
                            primary: true,
                        },
                        {
                            property: 'Status',
                            header: <Text weight="bold">Status?</Text>,
                        },
                    ]}
                    data={bezahl}
                />
                <Box className="platzhalter" ></Box>
                <Box className="ButtonBox">
                    <Button className="buttonInDash" label="Bezahloptionen konfigurieren" onClick={this.callConfiguratePaymentMethods}></Button>
                </Box>
            </Box>
        )
    }
}
class DataQuickViewBookings extends React.Component {
    //Gibt einen Schnellüberblick über die im System vorhandenen Buchungen
    constructor(props) {
        super(props);
        this.state = {
        };
        this.callShopManagementViewBookings = this.callShopManagementViewBookings.bind(this);
    }

    callShopManagementViewBookings() {
        //Leitet den User zur detailierten Buchungsübersicht und -freigabe weiter
        window.location.assign('#/eventmgmt/shop/viewBookings')
    }

    render() {
        //Stellt den Schnellüberblick für die Buchungen im Browser dar
        return (
            <Box name="statusBookings" className="quickViewOuterBox">
                <Text>Anzahl und Status der Buchungen im System:</Text>
                <Box className="platzhalter" ></Box>
                <DataTable className="quickViewDatatables"
                    columns={[
                        {
                            property: 'status',
                            header: <Text weight="bold">Status</Text>,
                            primary: true,
                        },
                        {
                            property: 'Anzahl',
                            header: <Text weight="bold">Anzahl</Text>,
                        },
                    ]}
                    data={this.props.statusBookings}
                />
                <Box className="platzhalter" ></Box>
                <Box className="ButtonBox">
                    <Button className="buttonInDash" label="Buchungen " onClick={this.callShopManagementViewBookings}></Button>
                </Box>
            </Box>
        )
    }
}

class DataQuickViewSalesStatistics extends React.Component {
    //Schnellüberblick über die Anzahl der Tickets, die Vorhanden/Verkauft/Storniert sind, sowie über die Anzahl der Rollstuhlfahrer
    constructor(props) {
        super(props);
        this.state = {
        };

    }


    render() {
        //Stellt den Schnellüberblick über die Tickets im Browser dar
        return (
            <Box name="statusSales" className="quickViewOuterBox">
                <Text>Anzahl und Status der Ticketbuchungen im System:</Text>
                <Box pad="small"></Box>
                <DataTable className="quickViewDatatables"
                    columns={[
                        {
                            property: 'status',
                            header: <Text weight="bold">Status</Text>,
                            primary: true,
                        },
                        {
                            property: 'Anzahl',
                            header: <Text weight="bold">Anzahl</Text>,
                        },
                    ]}
                    data={this.props.statusSales}
                />
                <Box className="platzhalter" ></Box>
            </Box>
        )
    }
}

class DataQuickViewManageSales extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.callShopManagementManageSales = this.callShopManagementManageSales.bind(this);
    }


    callShopManagementManageSales() {
        window.location.assign("#/eventmgmt/shop/ManageSalesStatus")
    }


    render() {
        var salesStatus;
        if (this.props.salesStatus) { salesStatus = [{ Beschreibung: "Ticketverkauf", Status: "Aktiv" }]; };
        if (!this.props.salesStatus) { salesStatus = [{ Beschreibung: "Ticketverkauf", Status: "Deaktiviert" }]; };

        return (
            <Box name="boxManageSales" className="quickViewOuterBox">
                <Text>Anzeige für den Status und das aktivieren</Text>
                <Text>und deaktivieren des Ticketverkaufs</Text>
                <Box pad="small"></Box>
                <DataTable className="quickViewDatatables"
                    columns={[
                        {
                            property: 'Beschreibung',
                            header: <Text weight="bold">Status</Text>,
                            primary: true,
                        },
                        {
                            property: 'Status',
                            header: <Text weight="bold">Anzahl</Text>,
                        },
                    ]}
                    data={salesStatus}
                />
                <Box className="platzhalter" ></Box>
                <Box Class-Name="ButtonBox">
                    <Button className="buttonInDash" label="Status ändern" onClick={this.callShopManagementManageSales}></Button>
                </Box>
            </Box>
        )
    }
}

class DataQuickViewCreateOTPS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.callShopManagementCreateOTPS = this.callShopManagementCreateOTPS.bind(this)
    }

    callShopManagementCreateOTPS() {
        window.location.assign("#/eventmgmt/shop/createOTPS")
    }

    switchInitialList() {
        if (this.props.initialList) {
            return "Eingelesen"
        }
        if (!this.props.initialList) {
            return "Nicht Eingelesen"
        }

    }

    render() {
        return (
            <Box name="CreateOTPS" className="quickViewOuterBox">
                <Text>Einlesen einer E-Mail Liste zum Erstellen</Text>
                <Text>von One Time Passwörtern:</Text>                
                <Box pad="small"></Box>

                <Text>Initiale Erstellung durchgeführt: </Text><Text weight="bold">{this.switchInitialList()}</Text>
                <Box className="platzhalter" ></Box>
                <Box Class-Name="ButtonBox">
                    <Button className="buttonInDash" label="Liste einlesen" onClick={this.callShopManagementCreateOTPS}></Button>
                </Box>
            </Box>
        )
    }
}
class DataQuickViewManageOTPS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.callShopManagementCreateOTPS = this.callShopManagementCreateOTPS.bind(this)
    }

    callShopManagementCreateOTPS() {
        window.location.assign("#/eventmgmt/shop/ManageOTPS")
    }

    render() {
        return (
            <Box name="CreateOTPS" className="quickViewOuterBox">
                <Text weight="bold" size="large">Erstellen neuer One Time Passwörter</Text>
                <Box pad="small" align="center">
                    <Text>Zum Erstellen neuer One Time Passwörter für:</Text>
                    <Text weight="bold">- Administratoren</Text>
                    <Text weight="bold">- Absolventen</Text>
                </Box>
                <Button className="buttonInDash" label="One Time Passwort verwalten" onClick={this.callShopManagementCreateOTPS}></Button>
            </Box>
        )
    }
}

class DataQuickViewViewOTPs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.callShopManagementViewOTPS = this.callShopManagementViewOTPS.bind(this)
    }

    callShopManagementViewOTPS() {
        window.location.assign("#/eventmgmt/shop/ViewOTPs")
    }

    render() {
        return (
            <Box name="CreateOTPS" className="quickViewOuterBox">
                <Text weight="bold" size="large">Vorhandene One Time Passwörter</Text>
                <Box pad="small" align="center">
                    <Text>Liste mit den existierenden One Time Passwörtern</Text>
                    <Text>und die Möglichkeit einzelne zu löschen.</Text>                    
                </Box>
                <Button className="buttonInDash" label="One Time Passwort verwalten" onClick={this.callShopManagementViewOTPS}></Button>
            </Box>
        )
    }
}

class ShopManagement extends React.Component {
    //Stellt die Übersichtsseite des Shopmanagements im Browser dar
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            initializeStep: 0,
            openBookings: 0,
            initialList: false,
            salesStatus: true,
            bankStatus: false,
            payPalStatus: false,
            maxPersonenProEvent: 0,
            maxTicketsProEvent: 0,
            maxTicketmenge: [{ Tickettype: "Absolvententickets", Anzahl: 1 },
            { Tickettype: "Begleitertickets", Anzahl: 2 }],
            statusBookings:
                [{ status: "Gebucht", Anzahl: 0 },
                { status: "Offen", Anzahl: 0 },
                { status: "Storniert", Anzahl: 0 }],
            statusSales:
                [{ status: "Verfügbar", Anzahl: 0 },
                { status: "Verkauft", Anzahl: 0 },
                { status: "Storniert", Anzahl: 0 },
                { status: "Rollstuhlfahrer", Anzahl: 0 }],
        }
        this.changeInitializeStep = this.changeInitializeStep.bind(this);
        this.getValuesFromConfig = this.getValuesFromConfig.bind(this);
        this.setConfMaxTicketsFromConf = this.setConfMaxTicketsFromConf.bind(this);
        this.setMaxTicketMenge = this.setMaxTicketMenge.bind(this);
        this.getBookings = this.getBookings.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setConfSalesStatus = this.setConfSalesStatus.bind(this);
        this.createOTPwithEmailAndRole = this.createOTPwithEmailAndRole.bind(this);
        this.setShopConfigInitialList = this.setShopConfigInitialList.bind(this);
        this.setBankStatus = this.setBankStatus.bind(this);
        this.setPayPalStatus = this.setPayPalStatus.bind(this);
        this.setConfBankStatus = this.setConfBankStatus.bind(this);
        this.setConfPayPalStatus = this.setConfPayPalStatus.bind(this);
        this.getPayPalStatus = this.getPayPalStatus.bind(this);
        this.getBankStatus = this.getBankStatus.bind(this);
        this.getTickets = this.getTickets.bind(this);
        this.setTickets = this.setTickets.bind(this);
    }

    changeInitializeStep(value) {
        this.setState({ initializeStep: value });
    }

    // Initialize Component - Execute Functions for 1. Get Bookings 2. Get Max Tickets
    componentDidMount() {
        this.getBookings();
        this.getTickets();
        this.getValuesFromConfig();
    }

    async getBookings() {
        //Ruft die Buchungen aus dem Backend ab, um diese in der Schnellübersicht darstellen zu können
        const response = await fetch(Config.BACKEND_BASE_URI + '/api/v2/bookings/', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
        }).catch(console.log);

        if (!response.ok) {
            switch (response.status) {
                case 500:
                    alert("Die Anmeldung ist aufgrund eines Server-Fehlers fehlgeschlagen. Bitte versuchen Sie es später erneut.");
                    break;
                case 501:
                    alert("Der Server kann die gewünschte Anfrage nicht ausführen.");
                    break;
                default:
                    let res = await response.json().catch(console.log);
                    alert(res.message);
            }
            return;
        } else {
            const rückgabe = await response.json().catch(console.log);
            if (rückgabe) {
                var bezahlt = 0;
                var unbezahlt = 0;
                var storniert = 0;
                for (var test = 0; test < rückgabe.length; test++) {
                    if (rückgabe[test].paidAt !== null && rückgabe[test].canceled === false) {
                        bezahlt = bezahlt + 1;
                    }
                    if (rückgabe[test].paidAt === null && rückgabe[test].canceled === false) {
                        unbezahlt = unbezahlt + 1;
                    }
                    if (rückgabe[test].canceled === true) {
                        storniert = storniert + 1;
                    }
                }
                this.setBookings(bezahlt, unbezahlt, storniert);
            }
        }
    }

    async getTickets() {
        //Ruft die Tickets aus dem Backend ab, um diese in der Schnellübersicht darstellen zu können
        const response = await fetch(Config.BACKEND_BASE_URI + '/api/v2/ticketsBooked', {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            }
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Abruf der Tickets erhalten");
            return;
        }
        if (!response.ok) {
            console.log("Fehler beim Abruf der Tickets: " + response.message);
            return;
        }
        if (response.ok) {
            const rückgabe = await response.json().catch(console.log);
            if (rückgabe) {
                var verfügbar = this.state.maxTicketsProEvent;
                var verkauft = 0;
                var storniert = 0;
                var rollstuhlFahrer = 0;
                
                    if (verfügbar) {
                        for (var lauf = 0; lauf < rückgabe.length; lauf++) {
                            if (rückgabe[lauf].createdAt && rückgabe[lauf].canceled !== true) {
                                verkauft = verkauft + 1;
                            }
                            if (rückgabe[lauf].createdAt && rückgabe[lauf].canceled === true) {
                                storniert = storniert + 1;
                            }
                            if (rückgabe[lauf].isWheelchairUser === true) {
                                rollstuhlFahrer = rollstuhlFahrer + 1;
                            }
                        }
                        verfügbar = verfügbar - verkauft;
                        this.setTickets(verfügbar, verkauft, storniert, rollstuhlFahrer);
                    }
            }
        }
    }

    //Get Max Tickets Configured form Configuration
    async getValuesFromConfig() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/shopConfig", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            }
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Abruf der Konfiguration erhalten!")
            return;
        }

        if (!response.ok) {
            console.log("Fehler beim Abrufen der Konfiguration: " + response.message)
            return;
        }
        if (response.ok) {
            var data = await response.json().catch(console.log)

            if (!data) {
                console.log("Keine Daten beim Abruf der Konfiugration erhalten!")
                return;
            }
            else {
                var maxTickets = [{ Tickettype: "Absolvententickets", Anzahl: data.max_TicketType_0_pro_Absolvent },
                { Tickettype: "Begleitertickets", Anzahl: data.max_TicketType_1_pro_Absolvent }]
                this.setState({
                    salesStatus: data.salesStatus,
                    maxPersonenProEvent: data.max_Person_pro_Event,
                    maxTicketsProEvent: data.max_Tickets_pro_Event,
                    initialList: data.initialeOPTListe,
                    maxTicketmenge: maxTickets
                })
                console.log("Die Konfiguration wurde erfolgreich eingelesen!");
            }
        }
    }

    // Write new Max Tickets into Configuration 
    async setConfMaxTicketsFromConf(absolvententickets, begleitertickets) {
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/shopConfig", {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
            body: JSON.stringify({
                max_TicketType_0_pro_Absolvent: absolvententickets,
                max_TicketType_1_pro_Absolvent: begleitertickets
            })
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Setzen der maximalen Ticketanzahl vom Backend-Server erhalten!");
            return;
        }
        if (!response.ok) {
            console.log("Fehler beim Setzten der Werte für die maximale Ticketanzahl: " + response.message);
            return;
        }

        if (response.ok) {
            this.setMaxTicketMenge(absolvententickets, begleitertickets)
        }
    };

    //Write max Tickets into Component State 
    setMaxTicketMenge(Absolvententickets, Begleitertickets) {
        var data = [{ Tickettype: "Absolvententickets", Anzahl: Absolvententickets },
        { Tickettype: "Begleitertickets", Anzahl: Begleitertickets }]
        this.setState({ maxTicketmenge: data })
    }

    setBookings(bezahlt, unbezahlt, storniert) {
        var data = [{ status: "Gebucht", Anzahl: bezahlt},
        { status: "Offen", Anzahl: unbezahlt},
        { status: "Storniert", Anzahl: storniert}];
        this.setState({ statusBookings: data });
    }

    setTickets(verfügbar, verkauft, storniert, rollstuhlFahrer) {
        var data = [{ status: "Verfügbar", Anzahl: verfügbar},
        { status: "Verkauft", Anzahl: verkauft},
        { status: "Storniert", Anzahl: storniert},
        { status: "Rollstuhlfahrer", Anzahl: rollstuhlFahrer}];
        this.setState({ statusSales: data });
    }

    // Write Sales Status to Config 
    async setConfSalesStatus(newSalesStatus) {
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/shopConfig", {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
            body: JSON.stringify({
                salesStatus: newSalesStatus
            })
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Setzen des Verkaufsstatus vom Backend-Server erhalten!")
            return;
        }
        if (!response.ok) {
            console.log("Fehler beim Setzten des Wertes für den Verkaufsstatus: " + response.message)
            return;
        }

        if (response.ok) {
            this.setSalesStatus(newSalesStatus)
            if (newSalesStatus) { console.log("Der Verkauf wurde aktiviert!") };
            if (!newSalesStatus) { console.log("Der Verkauf wurde deaktiviert!") };
        }
    };

    // Write salesStatus into Component State
    setSalesStatus(status) {
        this.setState({ salesStatus: status });
    }

    //Send E-Mail and Role to create a One Time Passwort
    async createOTPwithEmailAndRole(eMail, role) {
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/oneTimePasses", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
            body: JSON.stringify({
                email: eMail,
                targetRole: role
            })
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort vom Backend bei der Erstellung des One Time Passworts für die E-Mail:" + eMail)
            return;
        }
        if (!response.ok) {
            console.log("Fehler bei der Erstellung eines One Time Passwortes: " + response.message)
            return;
        }
        if (response.ok) {
            console.log("One Time Passwort für die E-Mail: " + eMail + " und der Rolle: " + role + " erstellt!")
            return 1;
        }
    };

    //TODO CHECK
    async setShopConfigInitialList(intialListStatus) {
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/shopConfig", {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
            body: JSON.stringify({
                initialeOPTListe: intialListStatus
            })
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Setzen des Wertes für die intiale OTP-Liste!")
            return;
        }
        if (!response.ok) {
            console.log("Fehler beim Setzten des Wertes für die intiale OTP-Liste: " + response.message)
        }

        if (response.ok) {
            if (intialListStatus) { console.log("Intiale OTP-Liste wurde eingelesen") };
            this.setState({ initialList: true })
        }
    };

    async setConfBankStatus(newBankStatus) {
        //Ändert den Status der Bankverbindung in der Schnellübersicht, wenn diese in den PaymentOptions verändert wird
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/paymentOptions", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Abrufen der Bankverbindung vom Backend-Server erhalten!")
            return;
        }
        if (!response.ok) {
            console.log("Fehler beim Abrufen der Bankverbindung vom Backendserver: " + response.message)
            return;
        }

        if (response.ok) {
            var paymentOptions = await response.json();
            paymentOptions.Bank.Aktiviert = newBankStatus;
            var response2 = await fetch(Config.BACKEND_BASE_URI + "/api/v2/paymentOptions", {
                method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.context.token,
                },
                body: JSON.stringify({
                    Bank: {
                        Empfänger: paymentOptions.Bank.Empfänger,
                        Name_der_Bank: paymentOptions.Bank.Name_der_Bank,
                        IBAN: paymentOptions.Bank.IBAN,
                        BIC: paymentOptions.Bank.BIC,
                        Verwendungszweck: paymentOptions.Bank.Verwendungszweck,
                        Aktiviert: paymentOptions.Bank.Aktiviert
                    }
                })
            }).catch(console.log)

            if (!response2) {
                console.log("Keine Antwort beim Schreiben der Bankverbindung auf den Backend-Server!");
                return;
            }
            if (!response2.ok) {
                console.log("Fehler beim Schreiben der Bankverbindung auf den Backend-Server: " + response2.message);
                return;
            }
            if (response2.ok) {
                this.setBankStatus(newBankStatus)
                if (newBankStatus) { console.log("Die Bankverbindung wurde aktiviert!") };
                if (!newBankStatus) { console.log("Die Bankverbindung wurde deaktiviert!") };
            }
        }
    };


    async setConfPayPalStatus(newPayPalStatus) {
        //Ändert den Status der PayPal-Verbindung in der Schnellübersicht, wenn diese in den PaymentOptions verändert wird
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/paymentOptions", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            }
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Abrufen der PayPal-Verbindung vom Backend-Server erhalten!")
            return;
        }
        if (!response.ok) {
            console.log("Fehler beim Abrufen der PayPal-Verbindung vom Backendserver: " + response.message)
            return;
        }
        var paymentOptions = await response.json();
        paymentOptions.PayPal.Aktiviert = newPayPalStatus;
        var response2 = await fetch(Config.BACKEND_BASE_URI + "/api/v2/paymentOptions", {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
            body: JSON.stringify({
                PayPal: {
                    PayPal_Link: paymentOptions.PayPal.PayPal_Link,
                    PayPal_Mail: paymentOptions.PayPal.PayPal_Mail,
                    PayPal_Verwendung: paymentOptions.PayPal.PayPal_Verwendung,
                    Aktiviert: paymentOptions.PayPal.Aktiviert
                }
            })
        }).catch(console.log)

        if (!response2) {
            console.log("Keine Antwort beim Schreiben der PayPal-Verbindung auf den Backend-Server!");
            return;
        }
        if (!response2.ok) {
            console.log("Fehler beim Schreiben der PayPal-Verbindung auf den Backend-Server: " + response2.message);
            return;
        }
        if (response2.ok) {
            this.setPayPalStatus(newPayPalStatus)
            if (newPayPalStatus) { console.log("Die PayPal-Verbindung wurde aktiviert!") };
            if (!newPayPalStatus) { console.log("Die PayPal-Verbindung wurde deaktiviert!") };
        }
    }

    setBankStatus(status) {
        //Setzt den lokalen Status der Bankverbindung
        this.setState({ bankStatus: status });
    }

    setPayPalStatus(status) {
        //Setzt den lokalen Status der PayPal-Verbindung
        this.setState({ payPalStatus: status });
    }

    async getBankStatus() {
        //Ruft den aktuellen Bankverbindungsstatus aus der Backend-Config ab
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/paymentOptions", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Abrufen der Bankverbindung vom Backend-Server erhalten!")
            return;
        }
        if (!response.ok) {
            console.log("Fehler beim Abrufen der Bankverbindung vom Backendserver: " + response.message)
            return;
        }

        if (response.ok) {
            var paymentOptions = await response.json();
            this.setState({ bankStatus: paymentOptions.Bank.Aktiviert });
            console.log("Der aktuelle Status der Bankverbindung ist: " + this.state.bankStatus);
        }
    }


    async getPayPalStatus() {
        //Ruft den aktuellen PayPal-Verbindungsstatus aus der Backend-Config ab
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/paymentOptions", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Abrufen der PayPal-Verbindung vom Backend-Server erhalten!")
            return;
        }
        if (!response.ok) {
            console.log("Fehler beim Abrufen der PayPal-Verbindung vom Backendserver: " + response.message)
            return;
        }
        if (response.ok) {
            var paymentOptions = await response.json();
            this.setState({ payPalStatus: paymentOptions.PayPal.Aktiviert });
            console.log("Der aktuelle Status der PayPal-Verbindung ist: " + this.state.payPalStatus);
        }
    }



    render() {
        return (
            <Switch>
                <Route path="/eventmgmt/shop/ConfMaxTickets">
                    <ShopManagementConfMaxTickets setConfMaxTicketsFromConf={this.setConfMaxTicketsFromConf}>
                    </ShopManagementConfMaxTickets>
                </Route>

                <Route path="/eventmgmt/shop/ViewBookings">
                    <ShopManagementViewBookings ></ShopManagementViewBookings>
                </Route>

                <Route path="/eventmgmt/shop/paymentOptions">
                    <ShopManagementPaymentOptions bankStatus={this.state.bankStatus} setConfBankStatus={this.setConfBankStatus} payPalStatus={this.state.payPalStatus}
                        setConfPayPalStatus={this.setConfPayPalStatus}></ShopManagementPaymentOptions>
                </Route>

                <Route path="/eventmgmt/shop/SalesStatistics">
                    <ShopManagementSalesStatistics></ShopManagementSalesStatistics>
                </Route>

                <Route path="/eventmgmt/shop/ManageSalesStatus">
                    <ShopManagementManageSalesStatus salesStatus={this.state.salesStatus} setConfSalesStatus={this.setConfSalesStatus}></ShopManagementManageSalesStatus>
                </Route>

                <Route path="/eventmgmt/shop/createOTPs">
                    <ShopManagamentAbsolventenListe createOTPwithEmailAndRole={this.createOTPwithEmailAndRole} setShopConfigInitialList={this.setShopConfigInitialList}></ShopManagamentAbsolventenListe>
                </Route>
                <Route path="/eventmgmt/shop/ManageOTPs">
                    <ShopManagementManageOTPS createOTPwithEmailAndRole={this.createOTPwithEmailAndRole}></ShopManagementManageOTPS>
                </Route>
                <Route path="/eventmgmt/shop/ViewOTPs">
                    <ShopManagementViewOTPs></ShopManagementViewOTPs>
                </Route>


                <Route path="/eventmgmt/shop">
                    <Box>
                        <Box>
                            <Text size="xxlarge" weight="bold" alignSelf="center">Willkommen in der Shop-Verwaltung</Text>
                            <Box pad="medium"></Box>
                        </Box>
                        <Box direction="row" wrap={true} justify="center">
                        <Box ClassName="twoGroupedBoards" direction="row" wrap={true} justify="center">
                            <DataQuickViewMaxTickets maxTicketmenge={this.state.maxTicketmenge}></DataQuickViewMaxTickets>
                            <DataQuickViewPayment bankStatus={this.state.bankStatus} getBankStatus={this.getBankStatus} payPalStatus={this.state.payPalStatus}
                                getPayPalStatus={this.getPayPalStatus}></DataQuickViewPayment>
                        </Box>
                        <Box ClassName="twoGroupedBoards" direction="row" wrap={true} justify="center">
                            <DataQuickViewBookings statusBookings={this.state.statusBookings}></DataQuickViewBookings>
                            <DataQuickViewSalesStatistics statusSales={this.state.statusSales}></DataQuickViewSalesStatistics>
                        </Box>
                        <Box ClassName="twoGroupedBoards" direction="row" wrap={true} justify="center">
                            <DataQuickViewManageSales salesStatus={this.state.salesStatus} setSalesStatus={this.setSalesStatus}></DataQuickViewManageSales>
                            <DataQuickViewCreateOTPS initialList={this.state.initialList}></DataQuickViewCreateOTPS>
                        </Box>
                        <Box ClassName="twoGroupedBoards" direction="row" wrap={true} justify="center">
                            <DataQuickViewManageOTPS ></DataQuickViewManageOTPS>
                            <DataQuickViewViewOTPs></DataQuickViewViewOTPs>
                        </Box>
                        </Box>
                    </Box>
                </Route>
            </Switch>
        );
    }
}

export default ShopManagement;
