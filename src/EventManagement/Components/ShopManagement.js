import React from 'react';
import { Box, Button, Text, DataTable } from 'grommet';
import Config from '../../config';
import './ShopManagement.css';
import ShopManagementConfMaxTickets from './ShopManagementConfMaxTickets';
import ShopManagementSalesStatistics from './ShopManagementSalesStatistics';
import ShopManagementViewBookings from './ShopManagementViewBookings';
import ShopManagementManageSalesStatus from './ShopManagementManageSalesStatus';
import ShopManagamentAbsolventenListe from './ShopManagamentAbsolventenListe';
import { Switch, Route, Link } from "react-router-dom";
import UserContext from '../../AppContexts/UserContext';

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
        var Ansicht = [];
        Ansicht[1] = <Box name="purchaseableTicketsPerPerson" className="quickViewOuterBox" >
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
        return Ansicht;
    }
}

class DataQuickViewPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.callConfiguratePaymentMethods = this.callConfiguratePaymentMethods.bind(this);
    }
    //Switch to Component PaymentOptions
    callConfiguratePaymentMethods() {
        window.location.assign("#/eventmgmt/shop/paymentOptions")
    }

    //Set Value of Paymentoption to String
    switchBooleanToString() {
        var bezahloptionenArray = [];
        for (let [key, value] of this.props.konfigurierteBezahloptionen) {
            var switcher = "";
            if (!value) {
                switcher = "Nicht Konfiguriert"
            }
            if (value) {
                switcher = "Konfiguriert"
            }
            bezahloptionenArray.push({ bezahlOption: key, konfiguriert: switcher })
        }
        return bezahloptionenArray;
    }

    render() {
        var Ansicht = [];
        Ansicht[0] = <Box name="paymentOptions" className="quickViewOuterBox">
            <Text>Übersicht der konfigurierten Bezahloptionen:</Text>
            <Box className="platzhalter" ></Box>
            <DataTable className="quickViewDatatables"
                columns={[
                    {
                        property: 'bezahlOption',
                        header: <Text weight="bold">Bezahloption</Text>,
                        primary: true,
                    },
                    {
                        property: 'konfiguriert',
                        header: <Text weight="bold">ist Konfiguriert?</Text>,
                    },
                ]}
                data={this.switchBooleanToString()}
            />
            <Box className="platzhalter" ></Box>
            <Box className="ButtonBox">
                <Button className="buttonInDash" label="Bezahloptionen konfigurieren" onClick={this.callConfiguratePaymentMethods}></Button>
            </Box>
        </Box>
        return Ansicht;
    }
}
class DataQuickViewBookings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.callShopManagementViewBookings = this.callShopManagementViewBookings.bind(this);
    }

    callShopManagementViewBookings() {
        var value = 3;
        this.props.changeInitializeStep(value);
    }

    render() {
        var Ansicht = [];
        Ansicht[1] = <Box name="statusBookings" className="quickViewOuterBox">
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
        return Ansicht;
    }
}

class DataQuickViewSalesStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.callShopManagementSalesStatistics = this.callShopManagementSalesStatistics.bind(this)
    }

    callShopManagementSalesStatistics() {
        var value = 4;
        this.props.changeInitializeStep(value);
    }


    render() {
        var Ansicht = [];
        Ansicht[1] = <Box name="statusSales" className="quickViewOuterBox">
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
            <Box Class-Name="ButtonBox">
                <Button className="buttonInDash" label="Tickets verwalten" onClick={this.callShopManagementSalesStatistics}></Button>
            </Box>
        </Box>
        return Ansicht;
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
        if (this.props.salesStatus) { salesStatus = { Beschreibung: "Ticketverkauf", Status: "Aktiv" }; };
        if (!this.props.salesStatus) { salesStatus = { Beschreibung: "Ticketverkauf", Status: "Deaktiviert" }; };

        var Ansicht = [];
        Ansicht[1] = <Box name="boxManageSales" className="quickViewOuterBox">
            <Text>Anzeige für den Status und das aktivieren und
                deaktivieren des Ticketverkaufs</Text>
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
        return Ansicht;
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
        if(this.props.initialList){
            return "Eingelesen"
        }
        if (!this.props.initialList){
            return "Nicht Eingelesen"
        }

    }


    render() {
        var Ansicht = [];
        Ansicht[1] = <Box name="CreateOTPS" className="quickViewOuterBox">
            <Text>Einlesen einer E-Mail Liste zum Erstellen von One Time Passwörtern:</Text>
            <Box pad="small"></Box>

            <Text>Initiale Erstellung durchgeführt: </Text><Text weight="bold">{this.switchInitialList()}</Text>
            <Box className="platzhalter" ></Box>
            <Box Class-Name="ButtonBox">
                <Button className="buttonInDash" label="Tickets verwalten" onClick={this.callShopManagementCreateOTPS}></Button>
            </Box>
        </Box>
        return Ansicht;
    }
}

class ShopManagement extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            initializeStep: 0,
            openBookings: 0,
            initialList: false,
            salesStatus: true,
            maxPersonenProEvent: 0,
            maxTicketsProEvent: 0,
            maxTicketmenge: [{ Tickettype: "Absolvententickets", Anzahl: 1 },
            { Tickettype: "Begleitertickets", Anzahl: 2 }],
            konfigurierteBezahloptionen: new Map([["Paypal", false], ["Überweisung", false]]),
            statusBookings:
                [{ status: "Gebucht", Anzahl: 0 },
                { status: "Offen", Anzahl: 0 },
                { status: "Storniert", Anzahl: 0 }],
            statusSales:
                [{ status: "Verfügbar", Anzahl: 0 },
                { status: "Verkauft", Anzahl: 0 },
                { status: "Beantragt", Anzahl: 0 },
                { status: "Stornieren", Anzahl: 0 }],
        }
        this.changeInitializeStep = this.changeInitializeStep.bind(this);
        this.getValuesFromConfig = this.getValuesFromConfig.bind(this);
        this.setConfMaxTicketsFromConf = this.setConfMaxTicketsFromConf.bind(this);
        this.setMaxTicketMenge = this.setMaxTicketMenge.bind(this);
        this.getBookings = this.getBookings.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setConfSalesStatus = this.setConfSalesStatus.bind(this);
        this.createOTPWithEmail = this.createOTPWithEmail.bind(this);
    }

    changeInitializeStep(value) {
        this.setState({ initializeStep: value });
    }

    // Initialize Component - Execute Functions for 1. Get Bookings 2. Get Max Tickets
    componentDidMount() {
        this.getBookings();
        this.getValuesFromConfig();
    }

    async getBookings() {
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
                console.log(rückgabe.length);
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
                this.setState({ salesStatus: data.salesStatus, maxTicketmenge: maxTickets, maxPersonenProEvent: data.max_Person_pro_Event, maxTicketsProEvent: data.max_Tickets_pro_Event })
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
            console.log("Die Anzahl der Maximalen Tickets pro Absolvent wurde erfolgreich auf: " + " Absolvententicket pro Absolvent: " + absolvententickets +
                " Begleitertickets pro Absolvent: " + begleitertickets + " geändert!")
        }
    };

    //Write max Tickets into Component State 
    setMaxTicketMenge(Absolvententickets, Begleitertickets) {
        var data = [{ Tickettype: "Absolvententickets", Anzahl: Absolvententickets },
        { Tickettype: "Begleitertickets", Anzahl: Begleitertickets }]
        this.setState({ maxTicketmenge: data })
    }

    setBookings(bezahlt, unbezahlt, storniert) {
        var data = [{ status: "Gebucht", Anzahl: bezahlt },
        { status: "Offen", Anzahl: unbezahlt },
        { status: "Storniert", Anzahl: storniert }];
        this.setState({ statusBookings: data });
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
    //Send Each Element to create a One Time Passwort
    async useListAndSendMail(emailList) {
        if(!emailList){
            console.log("Die übergebene Liste für die Erstellung der One Time Passwörter ist Leer!")
            return;
        }

        var counter = 0;

        emailList.forEach(element => {
            this.createOTPWithEmail(element);
        });
        console.log(counter + " One Time Passwörter erstellt!")
        this.setState({ initialList: true })
    }

    async createOTPWithEmail(element) {
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/oneTimePass", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ',
            },
            body: JSON.stringify({
                email: element.email,
                targetRole: 1
            })
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort vom Backend bei der Erstellung des One Time Passworts für die E-Mail:" + element.email)
            return;
        }
        if (!response.ok) {
            console.log("Fehler bei der Erstellung eines One Time Passwortes: " + response.message)
            return;
        }
        if (response.ok) {
            console.log("One Time Passwort für die E-Mail: " + element.email + " erstellt!")
            return 1;
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

                </Route>

                <Route path="/eventmgmt/shop/SalesStatistics">
                    <ShopManagementSalesStatistics></ShopManagementSalesStatistics>
                </Route>

                <Route path="/eventmgmt/shop/ManageSalesStatus">
                    <ShopManagementManageSalesStatus salesStatus={this.state.salesStatus} setConfSalesStatus={this.setConfSalesStatus}></ShopManagementManageSalesStatus>
                </Route>

                <Route path="/eventmgmt/shop/createOTPs">
                    <ShopManagamentAbsolventenListe useListAndSendMail={this.useListAndSendMail}></ShopManagamentAbsolventenListe>
                </Route>

                <Route path="/eventmgmt/shop">
                    <Box>
                        <Box>
                            <Text size="xxlarge" weight="bold" alignSelf="center">Willkommen in der Shop-Verwaltung</Text>
                            <Box pad="medium"></Box>
                            <Button label="QuickView aktualisieren" onClick={this.componentDidMount}></Button>
                        </Box>
                        <Box ClassName="twoGroupedBoards" direction="row" wrap={true} justify="center">
                            <DataQuickViewMaxTickets maxTicketmenge={this.state.maxTicketmenge}></DataQuickViewMaxTickets>
                            <DataQuickViewPayment konfigurierteBezahloptionen={this.state.konfigurierteBezahloptionen}></DataQuickViewPayment>
                        </Box>
                        <Box ClassName="twoGroupedBoards" direction="row" wrap="true">
                            <DataQuickViewBookings statusBookings={this.state.statusBookings}></DataQuickViewBookings>
                            <DataQuickViewSalesStatistics statusSales={this.state.statusSales}></DataQuickViewSalesStatistics>
                        </Box>
                        <Box ClassName="twoGroupedBoards" direction="row" wrap="true">
                            <DataQuickViewManageSales salesStatus={this.state.salesStatus} setSalesStatus={this.setSalesStatus}></DataQuickViewManageSales>
                            <DataQuickViewCreateOTPS initialList={this.state.initialList}></DataQuickViewCreateOTPS>
                        </Box>
                    </Box>
                </Route>
            </Switch>
        );
    }
}

export default ShopManagement;
