import React from 'react';
import { Box, Button, Heading, Text, TextInput, Select } from 'grommet';
import './ShopManagement.css';
import './ShopManagement.js';
import Config from '../../config';
import UserContext from '../../AppContexts/UserContext';

class ShopManagementPaymentOptions extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            receiverName: "", bankName: "", iban: "", bic: "", verwendung: "", bankAktiviert: false, payPalLink: "", payPalMail: "", payPalVerwendung: "",
            payPalAktiviert: false, bankStatus: "Deaktiviert", payPalStatus: "Deaktiviert"
        }
        this.changeStep = this.changeStep.bind(this);
        this.receiverNameHandler = this.receiverNameHandler.bind(this);
        this.bankNameHandler = this.bankNameHandler.bind(this);
        this.ibanHandler = this.ibanHandler.bind(this);
        this.bicHandler = this.bicHandler.bind(this);
        this.verwendungHandler = this.verwendungHandler.bind(this);
        this.assignBankValues = this.assignBankValues.bind(this);
        this.payPalLinkHandler = this.payPalLinkHandler.bind(this);
        this.payPalMailHandler = this.payPalMailHandler.bind(this);
        this.payPalVerwendungHandler = this.payPalVerwendungHandler.bind(this);
        this.assignPayPalValues = this.assignPayPalValues.bind(this);
        this.switchBankStatus = this.switchBankStatus.bind(this);
        this.setBankValuesAndChangeStep = this.setBankValuesAndChangeStep.bind(this);
        this.switchPayPalStatus = this.switchPayPalStatus.bind(this);
        this.setPayPalValuesAndChangeStep = this.setPayPalValuesAndChangeStep.bind(this);
    }

    changeStep() {
        window.location.assign('#/eventmgmt/shop');
    }

    receiverNameHandler(event) {
        this.setState({ receiverName: event.target.value });
    }

    bankNameHandler(event) {
        this.setState({ bankName: event.target.value });
    }

    ibanHandler(event) {
        this.setState({ iban: event.target.value });
    }

    bicHandler(event) {
        this.setState({ bic: event.target.value });
    }

    verwendungHandler(event) {
        this.setState({ verwendung: event.target.value });
    }

    async assignBankValues() {
        var empfänger = this.state.receiverName;
        var name_der_bank = this.state.bankName;
        var iban = this.state.iban;
        var bic = this.state.bic;
        var verwendungszweck = this.state.verwendung;
        var bankAktiviert = this.state.bankAktiviert;
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/paymentOptions", {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
            body: JSON.stringify({
                Bank: {
                    Empfänger: empfänger,
                    Name_der_Bank: name_der_bank,
                    IBAN: iban,
                    BIC: bic,
                    Verwendungszweck: verwendungszweck,
                    Aktiviert: bankAktiviert
                },
            }
            )
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Konfigurieren der Bankverbindung vom Backend-Server erhalten!");
            return;
        }
        if (!response.ok) {
            console.log("Fehler beim Setzten der Werte für die Bankverbindung: " + response.message);
            return;
        }

        if (response.ok) {
            console.log("Die Konfiguration der Bankverbindung wurde erfolgreich geändert. Die gesetzten Werte sind: Empfänger: " + empfänger + ", Name der Bank: " + name_der_bank +
                ", IBAN: " + iban + ", BIC: " + bic + ", Verwendungszweck: " + verwendungszweck);
        }
    }

    payPalLinkHandler(event) {
        this.setState({ payPalLink: event.target.value });
    }

    payPalMailHandler(event) {
        this.setState({ payPalMail: event.target.value });
    }

    payPalVerwendungHandler(event) {
        this.setState({ payPalVerwendung: event.target.value });
    }

    async assignPayPalValues() {
        var payPalLink = this.state.payPalLink;
        var payPalMail = this.state.payPalMail;
        var payPalVerwendung = this.state.payPalVerwendung;
        var payPalAktiviert = this.state.payPalAktiviert;
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/paymentOptions", {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
            body: JSON.stringify({
                PayPal: {
                    PayPal_Link: payPalLink,
                    PayPal_Mail: payPalMail,
                    PayPal_Verwendung: payPalVerwendung,
                    Aktiviert: payPalAktiviert
                }

            })
        }).catch(console.log)

        if (!response) {
            console.log("Keine Antwort beim Konfigurieren der PayPal-Verbindung vom Backend-Server erhalten!");
            return;
        }
        if (!response.ok) {
            console.log("Fehler beim Setzten der Werte für die PayPal-Verbindung: " + response.message);
            return;
        }

        if (response.ok) {
            console.log("Die Konfiguration der PayPal-Verbindung wurde erfolgreich geändert. Die gesetzten Werte sind: PayPal-Link: " + payPalLink + ", PayPal-Mail: " + payPalMail +
                ", PayPal-Verwendungszweck: " + payPalVerwendung);
        }
    }

    switchBankStatus() {
        if (this.props.bankStatus) {
            return <Text weight="bold"> Aktiviert </Text>
        }
        if (!this.props.bankStatus) {
            return <Text weight="bold"> Deaktiviert </Text>
        }
    }

    setBankValuesAndChangeStep() {
        var bankStatusBoolean = "";
        if (this.state.bankStatus === "Deaktiviert") {
            bankStatusBoolean = false;
        }
        if (this.state.bankStatus === "Aktiviert") {
            bankStatusBoolean = true;
        }
        if (bankStatusBoolean === this.props.bankStatus) {
            console.log("Der Status der Bankverbindung wurde wurde nicht verändert! Es wird keine Nachricht an das Backend gesendet")
            window.location.assign("#/eventmgmt/shop");
            return;
        }
        if (bankStatusBoolean !== this.props.bankStatus) {
            this.props.setConfBankStatus(bankStatusBoolean);
            window.location.assign("#/eventmgmt/shop");
        }

    }

    switchPayPalStatus() {
        if (this.props.payPalStatus) {
            return <Text weight="bold"> Aktiviert </Text>
        }
        if (!this.props.payPalStatus) {
            return <Text weight="bold"> Deaktiviert </Text>
        }
    }

    setPayPalValuesAndChangeStep() {
        var payPalStatusBoolean = "";
        if (this.state.payPalStatus === "Deaktiviert") {
            payPalStatusBoolean = false;
        }
        if (this.state.payPalStatus === "Aktiviert") {
            payPalStatusBoolean = true;
        }
        if (payPalStatusBoolean === this.props.payPalStatus) {
            console.log("Der Status der Bankverbindung wurde wurde nicht verändert! Es wird keine Nachricht an das Backend gesendet")
            window.location.assign("#/eventmgmt/shop");
            return;
        }
        if (payPalStatusBoolean !== this.props.payPalStatus) {
            this.props.setConfPayPalStatus(payPalStatusBoolean);
            window.location.assign("#/eventmgmt/shop");
        }

    }


    render() {
        var ansicht = [];
        return (
            ansicht[0] =
            <Box className="outerBoxOverview" direction="column" align="center">
                <Heading align="center" size="small">Konfiguration der Zahlungsmethoden</Heading>
                <Box pad="small" gap="small" align="center">
                    <Box pad="medium" gap="small">
                        <Text><b>Konfiguration einer Bankverbindung</b></Text>
                        <TextInput placeholder="Name des Empfängers" value={this.state.receiverName} onChange={this.receiverNameHandler}></TextInput>
                        <TextInput placeholder="Name der Bank" value={this.state.bankName} onChange={this.bankNameHandler}></TextInput>
                        <TextInput placeholder="IBAN" value={this.state.iban} onChange={this.ibanHandler}></TextInput>
                        <TextInput placeholder="BIC" value={this.state.bic} onChange={this.bicHandler}></TextInput>
                        <TextInput placeholder="Verwendungszweck" value={this.state.verwendung} onChange={this.verwendungHandler}></TextInput>
                        <Button label="Angaben für die Bankverbindung bestätigen" onClick={this.assignBankValues}></Button>
                        <Box>
                            <Text>Die Bankverbindung ist derzeit: {this.switchBankStatus()} </Text>
                        </Box>
                        <Box>
                            <Select
                                options={['Aktiviert', 'Deaktiviert']}
                                value={this.state.bankStatus}
                                onChange={({ option }) => { this.setState({ bankStatus: option }) }}
                            />
                            <Button label="Auswahl bestätigen" onClick={this.setBankValuesAndChangeStep}></Button>
                        </Box>
                    </Box>
                    <Box pad="medium" gap="small">
                        <Text><b>Konfiguration einer PayPal-Verbindung</b></Text>
                        <TextInput placeholder="PayPal.me-Link" value={this.state.payPalLink} onChange={this.payPalLinkHandler}></TextInput>
                        <TextInput placeholder="PayPal Mail-Adresse" value={this.state.payPalMail} onChange={this.payPalMailHandler}></TextInput>
                        <TextInput placeholder="PayPal Verwendungszweck" value={this.state.payPalVerwendung} onChange={this.payPalVerwendungHandler}></TextInput>
                        <Button label="Angaben für die PayPal-Verbindung bestätigen" onClick={this.assignPayPalValues}></Button>
                        <Box>
                        <Text>Die PayPal-Verbindung ist derzeit: {this.switchPayPalStatus()} </Text>
                        </Box>
                        <Box>
                            <Select
                                options={['Aktiviert', 'Deaktiviert']}
                                value={this.state.payPalStatus}
                                onChange={({ option }) => { this.setState({ payPalStatus: option }) }}
                            />
                            <Button label="Auswahl bestätigen" onClick={this.setPayPalValuesAndChangeStep}></Button>
                        </Box>
                    </Box>
                    <Button label="Zurück zur Übersicht" onClick={this.changeStep}></Button>
                </Box>
            </Box >
        );
    }
}
export default ShopManagementPaymentOptions;