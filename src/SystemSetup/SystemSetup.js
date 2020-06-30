import React from 'react';
import { Box, Button, Select, Text, List, TextInput } from 'grommet';
import Config from '../config';
import { CSVReader } from 'react-papaparse';

class Hauptansicht extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.getConfigured = this.getConfigured.bind(this);
    }

    getConfigured(key) {
        var wert = this.props.mapTest.get(key);
        if (!wert)
            return <Text key={key}>Nicht erledigt</Text>;
        if (wert)
            return <Text key={key}>Erledigt</Text>;
    }

    render() {
        var Ansicht = [];
        if (this.props.initializeStep === 0) {
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
        if (this.props.initializeStep === 6) {
            Ansicht[0] = <Box pad="medium" key="end">
                <Text textAlign="center">
                    Herzlich Glückwunsch Sie haben das Ticketsystem erfolgreich konfiguriert!
                    Mit "Zurück" gelangen Sie wieder zur ersten Ansicht und können erneut durch die Konfiguration navigieren.
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
                        { initializeStep: <Text weight="normal" key="StatusAdminAccount">Hinzufügen eines Administratorbenutzers</Text>, doneSteps: this.getConfigured("AA") },
                        { initializeStep: <Text weight="normal" key="StatusMS">Initialisieren des Mailservers</Text>, doneSteps: this.getConfigured("MS") },
                        { initializeStep: <Text weight="normal" key="StatusAdminWallet">Einrichten des Master-Wallets</Text>, doneSteps: this.getConfigured("AW") },
                        { initializeStep: <Text weight="normal" key="StatusListe">Einlesen der Absolventen-Liste und Erstellung der One Time Passwörter</Text>, doneSteps: this.getConfigured("AL") },
                    ]}
                />
            </Box>
        return Ansicht;
    }
}

class AddWallet extends React.Component {

    constructor(props) {
        super(props);
        this.state = { httpProvider: "" };
        this.configureTheAdminWallet = this.configureTheAdminWallet.bind(this);
    }

    //TODO: CONFIUGRE WALLET ANPASSEN AUF URI 
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
            var address = response.json().catch(console.log)
            this.props.setWalletAddress(address.wallet_address);
            this.props.changeValueOfmapTest("AW");
            this.props.changeStep();
        }
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>
            <Box pad="medium">
                <Text size="large" weight="bold">Hinzufügen des Wallets für den Master-User:</Text>
            </Box>
            <Box pad="medium">
                <TextInput
                    placeholder="HTTP-Provider DNS:Port"
                    value={this.state.httpProvider}
                    onChange={(event) => { this.setState({ httpProvider: event.target.value }) }}
                />
            </Box>
            <Button onClick={this.configureTheAdminWallet} label="Hinzufügen"></Button>
        </Box>
        return Ansicht;
    }
}

class DeploySmartContract extends React.Component {

    constructor(props) {
        super(props);
        this.state = { walletBalance: "", neededBalance: "" };
        this.deploySmartContract = this.deploySmartContract.bind(this);
        this.getBalanceFromWallet = this.getBalanceFromWallet.bind(this);
        this.getPriceOfContract = this.getPriceOfContract.bind(this);
    }

    async getPriceOfContract() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/api/v2/shopConfig", {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).catch(console.log)

        if (!response.ok) {
            const rückgabe = await response.json().catch(console.log);
            alert(rückgabe.message)
        }

        var data = await response.json().catch(console.log)

        if (!data) return

        console.log(data)

    }

    async getBalanceFromWallet() {
        var Web3 = require('web3');
        var web3 = new Web3(new Web3.providers.HttpProvider(this.props.httpProvider));

        // TODO: change from hardcoded address to address that was sent from the backend
        web3.eth.getBalance("0x6c1afA1A56d92EeFd99926636b1a1c284B0CE298", (error, response) => {
            if (error) {
                console.log("Fehler beim Abruf der Balance des Wallets");
            }
            if (!response) {
                console.log("Fehler beim Abruf der Balance des Wallets");
                alert(response.message);
            }
            console.log(response)

            if (response) {
                var balance = response;
                console.log(balance)
                this.setState({ walletBalance: balance });
            }
        });
    }


    //TODO: CONFIUGRE WALLET ANPASSEN AUF URI 
    async deploySmartContract() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/deployContract", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },
        }).catch(console.log)

        if (!response.ok) {
            const rückgabe = await response.json().catch(console.log);
            alert(rückgabe.message);
        }

        if (response.ok) {
            this.props.changeValueOfmapTest("DC");
            this.props.changeStep();
        }
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>
            <Box pad="medium">
                <Text size="large" weight="bold">Smart Contract auf der Blockchain veröffentlichen:</Text>
            </Box>
            <Box pad="medium">
                <TextInput
                    placeholder="HTTP-Provider DNS:Port"
                    value={this.state.httpProvider}
                    onChange={(event) => { this.setState({ httpProvider: event.target.value }) }}
                />
                <Button label="TEST" onClick={this.getPriceOfContract}></Button>
            </Box>
            <Button onClick={this.configureTheAdminWallet} label="Hinzufügen"></Button>
        </Box>
        return Ansicht;
    }
}



class ConfigureAdminAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = { email: "", password: "" };
        this.configureTheAdminAcc = this.configureTheAdminAcc.bind(this);
    }

    //TODO: CONFIUGRE WALLET ANPASSEN AUF URI 
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
            switch (response.status) {
                case 400: alert(rückgabe.message); break;
                case 410: alert(rückgabe.message); break;
                case 500: alert(rückgabe.message); break;
                default:
                    alert(rückgabe.message)
            }
        }

        if (response.ok) {
            this.props.changeValueOfmapTest("AA");
            this.props.changeStep();
        }
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>
            <Box pad="medium">
                <Text size="large" weight="bold">Hinzufügen des Administratorbenutzers:</Text>
            </Box>
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

    //TODO: Problem bei body 
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
            switch (response.status) {
                case 400: alert(rückgabe.message); break;
                case 410: alert(rückgabe.message); break;
                case 500: alert(rückgabe.message); break;
                default:
                    alert(rückgabe.message)
            }
        }
        if (response.ok) {
            this.props.changeValueOfmapTest("DB");
            this.props.changeStep();
        }
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>
            <Box pad="medium">
                <Text size="large" weight="bold">Konfigurieren der Datenbank:</Text>
            </Box>
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
        this.state = { host: "", port: null, conncetion: true, user: "", password: "", standardMail: "", standardPrefix: "" };
        this.configureTheMailserver = this.configureTheMailserver.bind(this);
    }
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
            switch (response.status) {
                case 400: alert(rückgabe.message); break;
                case 410: alert(rückgabe.message); break;
                case 500: alert(rückgabe.message); break;
                default:
                    alert(rückgabe.message)
            }
        }

        if (response.ok) {
            this.props.changeValueOfmapTest("MS");
            this.props.changeStep();
        }
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>
            <Text size="large" weight="bold">Konfigurieren des Mailservers:</Text>
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
                    onChange
                    ={(event) => { this.setState({ port: event.target.value }) }}
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
        //TODO STANDARD (????)
    }
}

// TODO: Diese Funktion sollte vielleicht eher ins Shop-Management
class AbsolventenListe extends React.Component {

    constructor(props) {
        super(props);
        this.state = { listeEingelesen: false, finished: false, initialeListe: [], dateiTyp: "CSV", path: "" };
        this.useListAndSendMail = this.useListAndSendMail.bind(this);
    }

    //TODO FUNKTION ERSTELLEN
    async useListAndSendMail() {
        var response = await fetch(Config.BACKEND_BASE_URI + "", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer f1df51e1835233014368105514f07a70e9f2255b279e5535810d7fbf2d565cc1d692d8b06d53f6157423bb3c63b97e5a42adfbe6277e48dc028d8043683acca13b1b9f83773015ff5f3533e9ad08943bac2eb003f24fc3e6c910d2e83e69f39ec1d3e3ac98d4d2965312670810aab8ec152338654bcab32e7c82cbe83545b0b5f307feed1976239fbe2718c97abab76768e6dcdb3e243fcead76ef2bc2ca72045f748da22dee9881a3aefe0b18ce9dd6d34eb4032ed56e1cb4d8bf11d2ff0d663b65f3ee2b2da04af8bc3b0473c4046fdc53248905d3499955f635c6ed9bb7e2defb03b54414ac617e4f73c96e6639bf1b89111458f5d830387f0c51e2c5a5d6',
            }
        }).catch(console.log)

        if (!response) return

        var data = await response.json().catch(console.log)

        if (!data.message) return

        this.setState({ finished: true })
        this.props.changeValueOfmapTest("AL");
        this.props.changeStep();
    }

    //Eingelesene Daten entgegennehmen und in den State schreiben
    handleOnDrop = (data) => {
        var liste = [];
        data.forEach((data) => {
            liste.push(data.data)
        });

        this.setState({ listeEingelesen: true, initialeListe: liste })
    }

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }

    handleOnRemoveFile = (data) => {
        
    }


    render() {
        var Ansicht = [];
        var emailList = this.state.initialeListe;
        Ansicht = <Box>
            <Box pad="medium">
                <Text size="large" weight="bold">Einlesen der Absolventen Liste</Text>
            </Box>

            {!this.state.listeEingelesen && !this.state.finished &&
                <Box className="Eingaben">
                    <Box pad="medium">
                        <Text>Bitte eine Liste in der folgenden Darstellung einlesen:</Text>
                        <span><Text weight="bold">Header: </Text><Text>E-Mail; Name</Text></span>
                        <span><Text weight="bold">Datensatz 1: </Text><Text>Beispiel@web.de; Mustermann, Max</Text></span>
                    </Box>
                    <CSVReader
                        onDrop={this.handleOnDrop}
                        onError={this.handleOnError}
                        config={{
                            delimiter: ";",
                            header: true
                        }}
                        addRemoveButton
                        onRemoveFile={this.handleOnRemoveFile}
                    >
                        <span>Drop CSV file here or click to upload.</span>
                    </CSVReader>
                </Box>
            }

            {this.state.listeEingelesen && !this.state.finished &&
                <List className="langeListe" pad="medium"
                    primaryKey="E-Mail"
                    secondaryKey="Name"
                    data={emailList}
                />
            }
            <Box pad="medium">
                <Button onClick={this.useListAndSendMail} label="Abschließen"></Button>
            </Box>

            {this.state.listeEingelesen && this.state.finished &&
                <Text>Bitte den Nächsten Schritt</Text>
            }

        </Box>
        return Ansicht;
    }
}

class SystemSetup extends React.Component {

    constructor(props) {
        super(props);
        this.changeStep = this.changeStep.bind(this);
        this.changeValueOfmapTest = this.changeValueOfmapTest.bind(this);
        this.setWalletAddress = this.setWalletAddress.bind(this);
        this.state = {
            initializeStep: 0,
            mapTest: new Map([["AW", false], ["DB", false], ["MS", false], ["AL", false], ["AA", false], ["DC", false]]),
            walletAddress: "",
            httpProvider: "",
        };
    }
    // TODO: Step fürs Aufladen des Backend-Wallets mit Ether...

    // Function to Change the Value of the state of Configuration
    changeValueOfmapTest(key) {
        this.setState(this.state.mapTest.set(key, true));
    }

    setWalletAddress(address) {
        this.setState({ walletAddress: address });
    }

    setHttpProvider(httpProvider) {
        this.setState({ httpProvider: httpProvider });
    }

    changeStep() {
        var value;
        if (this.state.initializeStep > 5) {
            value = 0;
        }
        if (this.state.initializeStep < 6) {
            value = 1 + this.state.initializeStep;
        }
        this.setState({ initializeStep: value });

    }

    render() {
        return (
            <Box className="SystemSetup" direction="column" gap="medium" pad="medium" align="center">
                {this.state.initializeStep === 0 && <Hauptansicht mapTest={this.state.mapTest} initializeStep={this.state.initializeStep}></Hauptansicht>}

                {this.state.initializeStep === 1 && <ConfigureDatabase changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}
                    changeStep={this.changeStep.bind(this)}></ConfigureDatabase>}

                {this.state.initializeStep === 2 && <ConfigureAdminAccount changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}
                    changeStep={this.changeStep.bind(this)}></ConfigureAdminAccount>}

                {this.state.initializeStep === 3 && <ConfigureMailserver changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}
                    changeStep={this.changeStep.bind(this)}></ConfigureMailserver>}

                {this.state.initializeStep === 4 && <AddWallet setWalletAddress={this.setWalletAddress.bind(this)} changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}
                    changeStep={this.changeStep.bind(this)}></AddWallet>}

                {this.state.initializeStep === 4 && <DeploySmartContract httpProvider={this.state.httpProvider} walletAddress={this.state.walletAddress} changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}
                    changeStep={this.changeStep.bind(this)}></DeploySmartContract>}

                {this.state.initializeStep === 5 && <AbsolventenListe changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}
                    changeStep={this.changeStep.bind(this)}></AbsolventenListe>}

                {this.state.initializeStep === 6 && <Hauptansicht mapTest={this.state.mapTest} initializeStep={this.state.initializeStep}
                    changeStep={this.changeStep.bind(this)}></Hauptansicht>}

                {this.state.initializeStep === 0 && <Button onClick={this.changeStep} label="Konfiguration beginnen"></Button>}
                {this.state.initializeStep !== 0 && this.state.initializeStep < 6 && <Button onClick={this.changeStep} label="Schritt überspringen"></Button>}
                {this.state.initializeStep === 6 && <Box pad="medium"> <Button label="Zurück" onClick={this.changeStep}></Button></Box>}
            </Box>
        );
    }
}

export default SystemSetup;