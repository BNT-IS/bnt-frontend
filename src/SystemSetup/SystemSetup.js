import React from 'react';
import { Box, Button, Select, Text, List, TextInput } from 'grommet';
import Config from '../config';

class Hauptansicht extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.getConfigured = this.getConfigured.bind(this);

    }

    //Function to Switch Boolean Values from statusMap into Text
    getConfigured(key) {
        var wert = this.props.statusMap.get(key);
        if (!wert)
            return <Text key={key}>Nicht erledigt</Text>;
        if (wert)
            return <Text key={key}>Erledigt</Text>;
    }

    render() {
        var Ansicht = [];
        //Start Text
        if (this.props.initializeStep === 0 && this.props.doneOnce === false) {
            Ansicht[0] = <Box pad="medium" key="start">
                <Text textAlign="center" weight="bold" size="xxlarge">
                    Herzlich Wilkommen zum Bachelors-Night Ticketsystem.
                </Text>
                <Box pad="medium"></Box>
                <Text>
                    Die nächsten Schritte dienen zur Initalisierung des Systems.
                    Sie werden durch die notwendigen Vorbereitungsschritte geführt.
                </Text>
                <Text textAlign="center">
                    Für die Initalisierung sind folgende Schritte notwendig
                </Text>
            </Box>
        }
        // Text if Steps are Finished
        if (this.props.initializeStep === 7 || this.props.doneOnce) {
            Ansicht[0] = <Box pad="medium" key="end">
                <Text weight="bold" size="xxlarge" textAlign="center">Konfiguration abgeschlossen</Text>
                <Box pad="medium"></Box>
                <Text textAlign="center">
                    Herzlich Glückwunsch Sie haben das Ticketsystem erfolgreich konfiguriert!
                    Mit "Zurück" gelangen Sie wieder zur ersten Ansicht und können erneut durch die Konfiguration navigieren.
                    Mit "Initalisierung abschließen" können Sie zur Login-Seite zurück.
                </Text>
            </Box>
        }
        Ansicht[1] =
            <Box>
                <List
                    primaryKey="initializeStep"
                    secondaryKey="doneSteps"
                    data={[
                        { initializeStep: <Text size="large" weight="bold" key="header">Vorbereitsungsschritt</Text>, doneSteps: <Text size="large" weight="bold" key="headerZustand">Zustand</Text> },
                        { initializeStep: <Text weight="normal" key="StatusDB"> Initalisieren der Datenbank</Text>, doneSteps: this.getConfigured("DB") },
                        { initializeStep: <Text weight="normal" key="StatusAdminAccount" >Hinzufügen eines Administratorbenutzers</Text>, doneSteps: this.getConfigured("AA") },
                        { initializeStep: <Text weight="normal" key="StatusMS">Initialisieren des Mailservers</Text>, doneSteps: this.getConfigured("MS") },
                        { initializeStep: <Text weight="normal" key="StatusAdminWallet">Einrichten des Master-Wallets</Text>, doneSteps: this.getConfigured("AW") },
                        { initializeStep: <Text weight="normal" key="StatusSmartContract">Veröffentlichen des Smart Contracts</Text>, doneSteps: this.getConfigured("DC") },
                        { initializeStep: <Text weight="normal" key="StatusShopConfig">Anzahl der Plätze, Tickets und VIP-Plätze festlegen</Text>, doneSteps: this.getConfigured("SC") },
                    ]}
                />
            </Box>
        return Ansicht;
    }
}

class AddWallet extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            httpProvider: "",
            created: false,
            deploymentPrice: "",
        };
        this.configureTheAdminWallet = this.configureTheAdminWallet.bind(this);
    }

    //Function to Send the HTTP-Request to gernerate a New Wallet 
    async configureTheAdminWallet() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/generateWallet", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                http_provider: this.state.httpProvider,
            })

        }).catch(console.log)

        if (!response.ok) {
            const rückgabe = await response.json().catch(console.log);
            alert(rückgabe.message);
        }

        if (response.ok) {
            console.log(response)
            var data = await response.json().catch(console.log)
            this.props.setWalletAddress(data.wallet_address);
            this.props.changeValueOfStatusMap("AW");
            this.props.changeValueOfGasprices("deployContract", data.price_deployment)
            this.setState({ deploymentPrice: data.price_deployment })
            this.setState({ created: true });
            this.props.setHttpProvider(this.state.httpProvider)
        }
    }

    render() {
        var Ansicht = [];
        //View if the Admin Wallet isnt created yet.
        if (!this.state.created) {
            Ansicht = <Box>
                <Box pad="medium"></Box>
                <Text weight="bold" size="xxlarge" align="center">Hinzufügen des Wallets für den Master-User</Text>
                <Box pad="medium"></Box>
                <Box pad="medium">
                    <TextInput
                        placeholder="HTTP-Provider DNS:Port"
                        value={this.state.httpProvider}
                        onChange={(event) => { this.setState({ httpProvider: event.target.value }) }}
                    />
                </Box>
                <Button onClick={this.configureTheAdminWallet} label="Hinzufügen"></Button>
            </Box>
        }
        //View if the Admin Wallet ist created
        if (this.state.created) {
            Ansicht = <Box>
                <Box pad="medium">
                    <Text size="large" weight="bold">Hinzufügen des Wallets für den Master-User:</Text>
                </Box>
                <Box pad="medium">
                    <Text>Die Einrichtung wurde Erfolgreich abgeschlossen. Für die Veröffentlichung des Smart Contracts wird</Text>
                    <Box pad="medium"></Box>
                    <Text weight="bold" size="xxlarge" align="center">Ethereum: {this.state.deploymentPrice}</Text><Text>benötigt.</Text>
                    <Box pad="medium"></Box>
                    <Text>Im nächsten Schritt wird zusätzlich noch eine geringe Menge Ethereum für die Erstellung eines Testtickets benötigt.</Text>
                    <Text>Laden Sie daher etwas mehr Ethereum in das Wallet!</Text>
                </Box>
                <Button label="Guthaben aufgeladen" onClick={this.props.changeStep}></Button>
            </Box>
        }
        return Ansicht;
    }
}

class DeploySmartContract extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            walletBalance: "",
            deployed: false
        };
        this.getBalanceFromWallet = this.getBalanceFromWallet.bind(this);
        this.checkBalancesAndExecute = this.checkBalancesAndExecute.bind(this);
    }
    
    componentDidMount(){
        this.getBalanceFromWallet();
    }

    // Get Balance From Adrress and calculate Wei -> Ether from Response this.props.walletAddress
    async getBalanceFromWallet() {
        if (this.props.httpProvider !== "" || this.props.walletAddress !== "") {
            var Web3 = require('web3');
            var web3 = new Web3(new Web3.providers.HttpProvider(this.props.httpProvider));
            console.log(Web3)
            web3.eth.getBalance(this.props.walletAddress, (error, response) => {
                console.log(response)
                if (error) {
                    console.log(error);
                    return;
                }
                if (!response) {
                    console.log("Fehler beim Abruf der Balance des Wallets");
                    alert(response.message);
                    return
                }

                if (response) {

                    var balance = web3.utils.fromWei(response, "ether")
                    console.log(balance);
                    this.setState({ walletBalance: balance });
                }
            });
        } else {
            alert("Fehler beim Abruf des Guthabens mit den Daten: ")
        }
    }

    //Function to Compare the Amount of Ether from the Wallet and the needed Ether to deploy the Contract -> If Enough Call the Deployment Function
    checkBalancesAndExecute() {
        this.getBalanceFromWallet();
        console.log(this.state.walletBalance);
        console.log(this.props.getValueOfGasPrices("deployContract"))
        if (this.state.walletBalance > this.props.getValueOfGasPrices("deployContract")) {
            this.deploySmartContract();
            console.log("Deployment Done")
        }
        else if (this.state.walletBalance < this.props.getValueOfGasPrices("deployContract")) {
            alert("Bitte zuerst das Wallet aufladen!")
        }
        else {
            alert("Ein unbestimmter Fehler ist aufgetreten! Das Deployment konnte nicht durchgeführt werden!")
        }
    }

    //Function to publish Contract on Blockchain and get Prices 
    async deploySmartContract() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/deployContract", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(console.log)

        if (!response.ok) {
            console.log("Fehler im Deployment")
            const rückgabe = await response.json().catch(console.log);
            alert(rückgabe.message);
            console.log(rückgabe.message)
        }

        if (response.ok) {
            var data = await response.json();
            this.props.changeValueOfGasprices("createTicket", data.create_ticket_price);
            this.props.changeValueOfGasprices("relinquishPlace", data.relinquish_place_price);
            this.props.changeValueOfStatusMap("DC");
            this.setState({ deployed: true })
            this.getBalanceFromWallet();
        }
    }

    render() {
        var Ansicht = [];
        if (!this.state.deployed) {
            Ansicht = <Box>
                <Box pad="medium"></Box>
                <Text weight="bold" size="xxlarge" align="center">Veröffentlichen des Smart Contracts</Text>
                <Box pad="medium"></Box>
                <Text weight="bold" size="large">Wallet-Daten</Text>
                <Text>Die Wallet-Adresse ist: {this.props.walletAddress}</Text>
                <Text> Das Guthaben des Wallets beträgt: {this.state.walletBalance}</Text>
                <Box pad="medium"></Box>
                <Text size="large" weight="bold">Smart Contract auf der Blockchain veröffentlichen:</Text>
                <Box pad="medium"></Box>
                <Button onClick={this.checkBalancesAndExecute} label="Hinzufügen"></Button>
            </Box>
        }

        if (this.state.deployed) {
            Ansicht = <Box>
                <Text>Der Contract wurde erfolgreich deployed.</Text>
                <Box pad="medium"></Box>
                <Text> Das Guthaben des Wallets beträgt: {this.state.walletBalance}</Text>
                <Text> Der Preis für die Erstellung eines Tickets beträgt: {this.props.getValueOfGasPrices("createTicket")}</Text>
                <Text> Der Preis für die Übertragung eines Tickets beträgt: {this.props.getValueOfGasPrices("relinquishPlace")}</Text>
                <Button onClick={this.props.changeStep} label="Weiter"></Button>
            </Box>
        }
        return Ansicht;
    }
};

class ConfigureAdminAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = { email: "", password: "" };
        this.configureTheAdminAcc = this.configureTheAdminAcc.bind(this);
    }

    //Function to Confiugre Admin Account in Database 
    async configureTheAdminAcc() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/adminUser", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            })
        }).catch(console.log)

        if (!response.ok) {
            const rückgabe = await response.json().catch(console.log);
            if (!response.ok) {
                alert(rückgabe.message)
            }
        }

        if (response.ok) {
            this.props.changeValueOfStatusMap("AA");
            this.props.changeStep();
        }
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>
            <Box pad="medium"></Box>
            <Text weight="bold" size="xxlarge" align="center">Hinzufügen des Administratorbenutzers</Text>
            <Box pad="medium"></Box>
            <Box pad="medium">
                <Text weight="bold">E-Mail-Adresse</Text>
                <TextInput
                    placeholder="E-Mail"
                    value={this.state.email}
                    onChange={(event) => { this.setState({ email: event.target.value }) }}
                />
            </Box>
            <Box pad="medium">
                <Text weight="bold">Passwort:</Text>
                <TextInput
                    placeholder="Passwort"
                    value={this.state.password}
                    onChange={(event) => { this.setState({ password: event.target.value }) }}
                />
            </Box>
            <Button onClick={this.configureTheAdminAcc} label="Hinzufügen"></Button>
        </Box>
        return Ansicht;
    }
}

class ConfigureDatabase extends React.Component {

    constructor(props) {
        super(props);
        this.state = { host: "", user: "", password: "", db: "", port: "" };
        this.configureTheDatabase = this.configureTheDatabase.bind(this);
    }

    //Function to send HTTP-Request to Configure Database
    async configureTheDatabase() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/database", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                host: this.state.host,
                user: this.state.user,
                password: this.state.password,
                database: this.state.db,
                port: this.state.port,
            })
        }).catch(console.log)
        if (!response.ok) {
            const rückgabe = await response.json().catch(console.log);
            alert(rückgabe.message)
        }
        if (response.ok) {
            this.props.changeValueOfStatusMap("DB");
            this.props.changeStep();
        }
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>
            <Box pad="medium"></Box>
            <Text weight="bold" size="xxlarge" align="center">Konfigurieren der Datenbank</Text>
            <Box pad="medium"></Box>
            <Box pad="medium">
                <Text weight="bold">Datenbank-Host:</Text>
                <TextInput
                    placeholder="Hier bitte den Datenbank-Host eingeben"
                    value={this.state.host}
                    onChange={(event) => { this.setState({ host: event.target.value }) }}
                />
            </Box>
            <Box pad="medium">
                <Text weight="bold">Port:</Text>
                <TextInput
                    placeholder="Hier bitte den Port eingeben"
                    value={this.state.port}
                    onChange={(event) => { this.setState({ port: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Text weight="bold">Benutzer:</Text>
                <TextInput
                    placeholder="Hier bitte den Benutzer eingeben"
                    value={this.state.user}
                    onChange={(event) => { this.setState({ user: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Text weight="bold">Passwort:</Text>
                <TextInput
                    placeholder="Hier bitte das Passwort eingeben"
                    value={this.state.password}
                    onChange={(event) => { this.setState({ password: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Text weight="bold"> Datenbank:</Text>
                <TextInput
                    placeholder="Hier bitte die Datenbank eingeben"
                    value={this.state.db}
                    onChange={(event) => { this.setState({ db: event.target.value }) }}
                />
            </Box>
            <Box pad="medium">
                <Button onClick={this.configureTheDatabase} label="Abschließen"></Button>
            </Box>
        </Box>
        return Ansicht;
    }
}

class ConfigureMailserver extends React.Component {
    constructor(props) {
        super(props);
        this.state = { host: "", port: "", conncetion: 'true', user: "", password: "", standardMail: "", standardPrefix: "" };
        this.configureTheMailserver = this.configureTheMailserver.bind(this);
    }

    //Function for HTTP-Request to Configure Mail Server
    async configureTheMailserver() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/mailserver", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                host: this.state.host,
                port: this.state.port,
                secure: this.state.conncetion,
                user: this.state.user,
                password: this.state.password,
                default_from: this.state.standardMail,
                default_subject_prefix: this.state.standardPrefix,
            })
        }).catch(console.log)

        if (!response.ok) {
            const rückgabe = await response.json().catch(console.log);
            if (!response.ok) {
                alert(rückgabe.message)
            }
        }

        if (response.ok) {
            this.props.changeValueOfStatusMap("MS");
            this.props.changeStep();
        }
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>
            <Box pad="medium"></Box>
            <Text weight="bold" size="xxlarge" align="center">Konfigurieren des Mailservers</Text>
            <Box pad="medium"></Box>
            <Box pad="small">
                <Text weight="bold">Mailserver-Host:</Text>
                <TextInput
                    placeholder="Hier bitte den Mailserver-Host eingeben"
                    value={this.state.textInput}
                    onChange={(event) => { this.setState({ host: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Text weight="bold"> Port:</Text>
                <TextInput
                    placeholder="Hier bitte den Port eingeben"
                    value={this.state.port}
                    onChange={(event) => { this.setState({ port: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Text weight="bold">Sichere Verbindung:</Text>
                <Select
                    options={['true', 'false']}
                    value={this.state.conncetion}
                    onChange={({ value, option }) => { this.setState({ conncetion: option }) }}
                />
            </Box>
            <Box pad="small">
                <Text weight="bold"> Benutzer:</Text>
                <TextInput
                    placeholder="Hier bitte den Benutzer eingeben"
                    value={this.state.user}
                    onChange={(event) => { this.setState({ user: event.target.value }) }}
                />
            </Box>

            <Box pad="small">
                <Text weight="bold">Passwort: </Text>
                <TextInput
                    placeholder="Hier bitte das Passwort eingeben"
                    value={this.state.password}
                    onChange={(event) => { this.setState({ password: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Text weight="bold">Standard Mail:</Text>
                <TextInput
                    placeholder="Hier bitte die Standard Mail eingeben"
                    value={this.state.standardMail}
                    onChange={(event) => { this.setState({ standardMail: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Text weight="bold">Standard Subject Prefix:</Text>
                <TextInput
                    placeholder="Hier bitte den Standard Prefix eingeben"
                    value={this.state.standardPrefix}
                    onChange={(event) => { this.setState({ standardPrefix: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Button onClick={this.configureTheMailserver} label="Abschließen"></Button>
            </Box>
        </Box>
        return Ansicht;
    }
}

class ConfigureShopConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxPersonenProEvent: "",
            maxTicketProEvent: "",
            maxVIPPersonen: ""
        };

        this.configureTheShopConfig = this.configureTheShopConfig.bind(this);
    }

    //Function for HTTP-Request to set Shop Configuration
    async configureTheShopConfig() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/shopConfig", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                max_Person_pro_Event: this.state.maxPersonenProEvent,
                max_Tickets_pro_Event: this.state.maxTicketProEvent,
                max_VIP_Person: this.state.maxVIPPersonen
            })
        }).catch(console.log)

        if (!response.ok) {
            const rückgabe = await response.json().catch(console.log);
            if (!response.ok) {
                alert(rückgabe.message)
            }
        }

        if (response.ok) {
            this.props.setShopConfiguration(this.state.maxPersonenProEvent, this.state.maxTicketProEvent, this.state.maxVIPPersonen);
            this.props.changeStep();
        }
    }

    render() {
        var Ansicht = []
        Ansicht[0] = <Box>
            <Box pad="medium"></Box>
            <Text weight="bold" size="xxlarge">Konfigurieren der Shop Grundeinstellungen:</Text>
            <Box pad="medium"></Box>
            <Box pad="small">
                <Text weight="bold">Maximale Personen pro Event:</Text>
                <TextInput
                    placeholder="Max Personen pro Event"
                    value={this.state.maxPersonenProEvent}
                    onChange={(event) => { this.setState({ maxPersonenProEvent: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Text weight="bold">Maximale Anzahl an Tickets pro Event:</Text>
                <TextInput
                    placeholder="Max Tickets pro Event"
                    value={this.state.maxTicketProEvent}
                    onChange={(event) => { this.setState({ maxTicketProEvent: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Text weight="bold">Maximale Anzahl der VIP-Personen pro Event:</Text>
                <TextInput
                    placeholder="Max VIP-Personen pro Event"
                    value={this.state.maxVIPPersonen}
                    onChange={(event) => { this.setState({ maxVIPPersonen: event.target.value }) }}
                />
            </Box>
            <Box pad="small">
                <Button onClick={this.configureTheShopConfig} label="Hinzufügen"></Button>
            </Box>
        </Box>


        return Ansicht;
    }

}

class SystemSetup extends React.Component {

    constructor(props) {
        super(props);
        this.changeStep = this.changeStep.bind(this);
        this.changeValueOfStatusMap = this.changeValueOfStatusMap.bind(this);
        this.setWalletAddress = this.setWalletAddress.bind(this);
        this.changeValueOfGasprices = this.changeValueOfGasprices.bind(this);
        this.getValueOfGasPrices = this.getValueOfGasPrices.bind(this);
        this.setShopConfiguration = this.setShopConfiguration.bind(this);
        this.goToStep = this.goToStep.bind(this);
        this.state = {
            initializeStep: 0,
            doneOnce: false,
            statusMap: new Map([["AW", false], ["DB", false], ["MS", false], ["AL", false], ["AA", false], ["DC", false], ["SC", false]]),
            gasPrices: new Map([["deployContract", ""], ["createTicket", ""], ["relinquishPlace", ""]]),
            shopConfig: new Map([["MaxPersonProEvent", ""], ["MaxTicketProEvent", ""], ["MaxVIPPersonen", ""]]),
            walletAddress: "",
            httpProvider: "",
        };
    }

    //Function to Set GasPrices in gasPriceMap
    changeValueOfGasprices(key, price) {
        this.setState(this.state.gasPrices.set(key, price));
    }

    getValueOfGasPrices(key) {
        var price = this.state.gasPrices.get(key);
        return price;
    }

    //Function to change Value of StatusMap 
    changeValueOfStatusMap(key) {
        this.setState(this.state.statusMap.set(key, true));
    }

    //Function to set WalletAddress as State
    setWalletAddress(address) {
        this.setState({ walletAddress: address });
    }

    //FUnction to set HTTP-Provider as State
    setHttpProvider(httpProvider) {
        this.setState({ httpProvider: httpProvider });
    }

    //Function to set Shop-Configuration Values into Map
    setShopConfiguration(maxPersonenProEvent, maxTicketProEvent, maxVIPPersonen) {
        let values = this.state.shopConfig
        values = new Map([["MaxPersonProEvent", maxPersonenProEvent], ["MaxTicketProEvent", maxTicketProEvent], ["MaxVIPPersonen", maxVIPPersonen]])
        this.setState({ shopConfig: values })
    }

    // Function to Change the Value of the state of Configuration
    changeStep() {
        var value;
        var doneOnceBooolean;

        // Set Initialize Step to 0 to Start a new Process flow
        if (this.state.initializeStep > 6) {
            value = 0;
            this.setState({
                initializeStep: value,
            });
        }
        // Finished all Configuration once - Set Boolean to true and switch to last View
        if (this.state.initializeStep === 6) {
            value = 1 + this.state.initializeStep;
            doneOnceBooolean = true;

            this.setState({
                initializeStep: value,
                doneOnce: doneOnceBooolean
            });
        }
        // Normal Process Flow - Add 1 to Initialize Step 
        if (this.state.initializeStep < 7) {
            value = 1 + this.state.initializeStep;
            this.setState({
                initializeStep: value,
            });
        }
    }

    finishSystemSetup() {
        window.location.assign("#/login")
    }

    goToStep(value) {
        this.setState({ initializeStep: value })
    }

    render() {
        return (
            <Box className="SystemSetup" direction="column" gap="medium" pad="medium" align="center">
                {this.state.initializeStep === 0 && <Hauptansicht goToStep={this.goToStep.bind(this)} doneOnce={this.state.doneOnce} statusMap={this.state.statusMap} initializeStep={this.state.initializeStep}></Hauptansicht>}

                {this.state.initializeStep === 1 && <ConfigureDatabase changeValueOfStatusMap={this.changeValueOfStatusMap.bind(this)}
                    changeStep={this.changeStep.bind(this)}></ConfigureDatabase>}

                {this.state.initializeStep === 2 && <ConfigureAdminAccount changeValueOfStatusMap={this.changeValueOfStatusMap.bind(this)}
                    changeStep={this.changeStep.bind(this)}></ConfigureAdminAccount>}

                {this.state.initializeStep === 3 && <ConfigureMailserver changeValueOfStatusMap={this.changeValueOfStatusMap.bind(this)}
                    changeStep={this.changeStep.bind(this)}></ConfigureMailserver>}

                {this.state.initializeStep === 4 && <AddWallet setWalletAddress={this.setWalletAddress.bind(this)} changeValueOfStatusMap={this.changeValueOfStatusMap.bind(this)}
                    changeStep={this.changeStep.bind(this)} changeValueOfGasprices={this.changeValueOfGasprices.bind(this)} getValueOfGasPrices={this.getValueOfGasPrices.bind(this)} setHttpProvider={this.setHttpProvider.bind(this)}></AddWallet>}

                {this.state.initializeStep === 5 && <DeploySmartContract httpProvider={this.state.httpProvider} walletAddress={this.state.walletAddress} changeValueOfStatusMap={this.changeValueOfStatusMap.bind(this)}
                    changeStep={this.changeStep.bind(this)} getValueOfGasPrices={this.getValueOfGasPrices.bind(this)} changeValueOfGasprices={this.changeValueOfGasprices.bind(this)}></DeploySmartContract>}

                {this.state.initializeStep === 6 && <ConfigureShopConfig setShopConfiguration={this.setShopConfiguration.bind(this)} changeStep={this.changeStep.bind(this)}></ConfigureShopConfig>}
                {this.state.initializeStep === 7 && <Hauptansicht goToStep={this.goToStep.bind(this)} doneOnce={this.state.doneOnce} statusMap={this.state.statusMap} initializeStep={this.state.initializeStep}
                    changeStep={this.changeStep.bind(this)}></Hauptansicht>}

                {this.state.initializeStep === 0 && this.state.doneOnce === false && <Button onClick={this.changeStep} label="Konfiguration beginnen"></Button>}
                {this.state.initializeStep === 0 && this.state.doneOnce === true && <Button onClick={this.changeStep} label="Erneuter Durchlauf"></Button>}
                {this.state.initializeStep !== 7 && this.state.initializeStep !== 0 && this.state.initializeStep < 7 && <Button onClick={this.changeStep} label="Schritt überspringen"></Button>}
                {this.state.initializeStep === 7 && <Box pad="medium"> <Button label="Zurück" onClick={this.changeStep}></Button></Box>}
                {this.state.doneOnce === true && (this.state.initializeStep === 0 || this.state.initializeStep === 7) && <Button label="Initialisierung abschließen" onClick={this.finishSystemSetup}></Button>}
            </Box>
        );
    }
}

export default SystemSetup;
