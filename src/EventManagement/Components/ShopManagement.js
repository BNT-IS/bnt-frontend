import React from 'react';
import { Box, Button, Text, DataTable } from 'grommet';
import Config from '../../config';
import './ShopManagement.css';
import ShopManagementConfMaxTickets from './ShopManagementConfMaxTickets';
import ShopManagementSalesStatistics from './ShopManagementSalesStatistics'
import ShopManagementViewBookings from './ShopManagementViewBookings'

import UserContext from '../../AppContexts/UserContext'

class DataQuickViewMaxTickets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.callShopManagamentConfTickets = this.callShopManagamentConfTickets.bind(this);

    }
    callShopManagamentConfTickets() {
        var value = 1;
        this.props.changeInitializeStep(value);
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

    callConfiguratePaymentMethods() {
        var value = 2;
        this.props.changeInitializeStep(value);
    }

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
        var value = 5;
        this.props.changeInitializeStep(value);
    }


    render() {
        var salesStatus;
        if(this.props.salesStatus){salesStatus = {Beschreibung: "Ticketverkauf", Status: "Aktiv"};};
        if(!this.props.salesStatus){salesStatus= {Beschreibung: "Ticketverkauf", Status: "Deaktiviert"};};

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

class ShopManagement extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            initializeStep: 0,
            openBookings: 0,
            salesStatus: true,
            maxTicketmenge: [{ Tickettype: "Absolvententickets", Anzahl: 1 },
            { Tickettype: "Begleitertickets", Anzahl: 2 },
            { Tickettype: "Parkttickets", Anzahl: 1 }],
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
        this.setMaxTicketMenge = this.setMaxTicketMenge.bind(this);
        this.getBookings = this.getBookings.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    changeInitializeStep(value) {
        this.setState({ initializeStep: value });
    }

    componentDidMount(){
        this.getBookings();
    }

    async getBookings(){
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
                for(var test = 0; test < rückgabe.length; test++){
                    if(rückgabe[test].paidAt !== null && rückgabe[test].canceled === false){
                        bezahlt = bezahlt + 1;
                    }
                    if(rückgabe[test].paidAt === null && rückgabe[test].canceled === false){
                        unbezahlt = unbezahlt + 1;
                    }
                    if(rückgabe[test].canceled === true){
                        storniert = storniert + 1;
                    }
                }
                this.setBookings(bezahlt, unbezahlt, storniert);
            }
        }
    }

    setBookings(bezahlt, unbezahlt, storniert){
        var data = [{ status: "Gebucht", Anzahl: bezahlt },
        { status: "Offen", Anzahl: unbezahlt },
        { status: "Storniert", Anzahl: storniert }];
        this.setState({statusBookings: data});
    }

    //TODO AUS KONFIG ABRUFEN und mit SHOPMANGEMENT CONFTICKETS VERKNÜPFEN
    setMaxTicketMenge(Absolvententickets, Begleitertickets, Parkttickets) {
        var data = [{ Tickettype: "Absolvententickets", Anzahl: Absolvententickets },
        { Tickettype: "Begleitertickets", Anzahl: Begleitertickets },
        { Tickettype: "Parkttickets", Anzahl: Parkttickets }]
        this.setState({maxTicketmenge: data});
    }
    setSalesStatus(status){
        this.setState({salesStatus: status});
    }

    render() {
        return (
            <Box className="outerBoxOverview" direction="column" align="center">
                {this.state.initializeStep === 0 && <Box>
                    <Box>
                        <Text size="xxlarge" weight="bold" alignSelf="center">Willkommen in der Shop-Verwaltung</Text>
                        <Box pad="medium"></Box>
                        <Button label="QuickView aktualisieren" onClick={this.componentDidMount}></Button>
                    </Box>
                    <Box ClassName="twoGroupedBoards" direction="row" wrap={true} justify="center">
                        <DataQuickViewMaxTickets maxTicketmenge={this.state.maxTicketmenge} changeInitializeStep={this.changeInitializeStep}></DataQuickViewMaxTickets>
                        <DataQuickViewPayment konfigurierteBezahloptionen={this.state.konfigurierteBezahloptionen}></DataQuickViewPayment>
                    </Box>
                    <Box ClassName="twoGroupedBoards" direction="row" wrap="true">
                        <DataQuickViewBookings statusBookings={this.state.statusBookings} changeInitializeStep={this.changeInitializeStep}></DataQuickViewBookings>
                        <DataQuickViewSalesStatistics statusSales={this.state.statusSales} changeInitializeStep={this.changeInitializeStep}></DataQuickViewSalesStatistics>
                    </Box>
                    <Box ClassName="twoGroupedBoards" direction="row" wrap="true">
                        <DataQuickViewManageSales salesStatus={this.state.salesStatus} setSalesStatus={this.setSalesStatus} changeInitializeStep={this.changeInitializeStep}></DataQuickViewManageSales>

                    </Box>
                </Box>}
                {this.state.initializeStep === 1 && <ShopManagementConfMaxTickets
                    maxTicketmenge={this.state.maxTicketmenge} setMaxTicketMenge={this.setMaxTicketMenge}
                    changeInitializeStep={this.changeInitializeStep}></ShopManagementConfMaxTickets>}

                {this.state.initializeStep === 3 && <ShopManagementViewBookings
                    changeInitializeStep={this.changeInitializeStep}
                ></ShopManagementViewBookings>}
                {this.state.initializeStep === 4 && <ShopManagementSalesStatistics changeInitializeStep={this.changeInitializeStep}>
                </ShopManagementSalesStatistics>}
            </Box>
        );
    }
}

export default ShopManagement;