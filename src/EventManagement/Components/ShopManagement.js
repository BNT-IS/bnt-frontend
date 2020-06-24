import React from 'react';
import { Box, Button, Select, Text, List, TextInput, DataTable, Meter } from 'grommet';
import Config from '../../config';
import './ShopManagement.css';

class DataQuickViewTickets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    render() {
        var Ansicht = [];
        Ansicht[1] = <Box name="purchaseableTicketsPerPerson" className="quickViewOuterBox" >
            <Text>Anzahl der Tickets die ein Absolvent erwerben kann:</Text>
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
                        header: <Text weight="bold">Freigebene Anzahl</Text>,
                    },
                ]}
                data={this.props.maxTicketmenge}
            />
            <Box className="platzhalter" ></Box>
            <Box className="ButtonBox">
            <Button className="buttonInDash" label="Ticketanzahl konfigurieren"></Button>
            </Box>
        </Box>
        return Ansicht;
    }
}

class DataQuickViewPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
        console.log(bezahloptionenArray)
        return bezahloptionenArray;
    }

    render() {
        var Ansicht = [];
        Ansicht[0] = <Box name="paymentOptions" className="quickViewOuterBox">
            <Text>Übersicht der Konfigurierten Bezahloptionen:</Text>
            <Box className="platzhalter" ></Box>
            <DataTable className="quickViewDatatables"
                columns={[
                    {
                        property: 'bezahlOption',
                        header: <Text weight="bold">Tickettyp</Text>,
                        primary: true,
                    },
                    {
                        property: 'konfiguriert',
                        header: <Text weight="bold">Ist Konfiguriert</Text>,
                    },
                ]}
                data={this.switchBooleanToString()}
            />
            <Box className="platzhalter" ></Box>
            <Box className="ButtonBox">
            <Button className="buttonInDash" label="Bezahloptionen konfigurieren"></Button>
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
                        header: <Text weight="bold">Tickettyp</Text>,
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
            <Button className="buttonInDash" label="Buchungen "></Button>
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
                        header: <Text weight="bold">Tickettyp</Text>,
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
            <Button className="buttonInDash" label="Tickets verwalten"></Button>
            </Box>
        </Box>
        return Ansicht;
    }
}

class ShopManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            initializeStep: 0,
            openBookings: 0,
            maxTicketmenge: [{ Tickettype: "Absolvententickets", Anzahl: 1 },
            { Tickettype: "Begleitertickets", Anzahl: 2 },
            { Tickettype: "Parkttickets", Anzahl: 1 }],
            konfigurierteBezahloptionen: new Map([["Paypal", false], ["Überweisung", false]]),
            statusBookings:
                [{ status: "Gebucht", Anzahl: 0 },
                { status: "Offen", Anzahl: 0 },
                { status: "Stornieren", Anzahl: 0 }],
            statusSales:
                [{ status: "Verfügbar", Anzahl: 0 },
                { status: "Verkauft", Anzahl: 0 },
                { status: "Beantragt", Anzahl: 0 },
                { status: "Stornieren", Anzahl: 0 }],
        }
    }

    render() {
        return (
            <Box className="outerBoxOverview" direction="column" align="center">
                <Box>
                    <Text size="xxlarge" weight="bold">Hallo das ist die Übersicht der Shop Verwaltung</Text>
                    <Box pad="medium"></Box>
                </Box>
                <Box ClassName="twoGroupedBoards" direction="row" wrap="true">
                    <DataQuickViewTickets maxTicketmenge={this.state.maxTicketmenge}></DataQuickViewTickets>
                    <DataQuickViewPayment konfigurierteBezahloptionen={this.state.konfigurierteBezahloptionen}></DataQuickViewPayment>
                </Box>
                <Box ClassName="twoGroupedBoards" direction="row" wrap="true">
                    <DataQuickViewBookings statusBookings={this.state.statusBookings}></DataQuickViewBookings>
                    <DataQuickViewSalesStatistics statusSales={this.state.statusSales}></DataQuickViewSalesStatistics>


                </Box>
            </Box >
        );
    }
}

export default ShopManagement;
