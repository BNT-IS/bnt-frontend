import React from 'react';
//import './TicketOverview.css';
import { Box, Button, Select, Text, List, TextInput } from 'grommet';
import Config from '../../config';
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
                <Text textAlign="center">
                    Guten Tag und Herzlich Wilkommen zum Ticketsystem.
                </Text>
                <Text>
                    Die nächsten Schritte dienen zur Initalisierung des Systems.
                    Sie werden durch die notwendigen Vorbereitungsschritte geführt.
                </Text>
                <Text textAlign="center">
                    Für die Initalisierung sind folgende Schritte notwendig
                </Text>
            </Box>
        }
        if (this.props.initializeStep === 5) {
            Ansicht[0] = <Box pad="medium" key="end">
                <Text textAlign="center">
                    Herzlich Glückwunsch Sie haben das Ticketsystem erfolgreich konfiguriert!
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
                        { initializeStep: <Text weight="normal" key="StatusAdminWallet">Hinzufügen eines Wallets für den Master-User</Text>, doneSteps: this.getConfigured("AW") },
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
        this.state = { addresse: "", };
        this.configureTheAdminWallet = this.configureTheAdminWallet.bind(this);
    }

    //TODO: CONFIUGRE WALLET ANPASSEN AUF URI 
    async configureTheAdminWallet() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/generateWallet", {
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

        this.props.changeValueOfmapTest("AW");
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
                    value={this.state.addresse}
                    onChange={(event) => { this.setState({ addresse: event.target.value }) }}
                />
            </Box>
            <Button onClick={this.setValueTrue} label="Hinzufügen"></Button>
        </Box>
        return Ansicht;
    }
}

class ConfigureAdminAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {eMail:"", password: "", role: 0 };
        this.configureTheAdminAcc = this.configureTheAdminAcc.bind(this);
        }

    //TODO: CONFIUGRE WALLET ANPASSEN AUF URI 
    async configureTheAdminAcc() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/admin", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer f1df51e1835233014368105514f07a70e9f2255b279e5535810d7fbf2d565cc1d692d8b06d53f6157423bb3c63b97e5a42adfbe6277e48dc028d8043683acca13b1b9f83773015ff5f3533e9ad08943bac2eb003f24fc3e6c910d2e83e69f39ec1d3e3ac98d4d2965312670810aab8ec152338654bcab32e7c82cbe83545b0b5f307feed1976239fbe2718c97abab76768e6dcdb3e243fcead76ef2bc2ca72045f748da22dee9881a3aefe0b18ce9dd6d34eb4032ed56e1cb4d8bf11d2ff0d663b65f3ee2b2da04af8bc3b0473c4046fdc53248905d3499955f635c6ed9bb7e2defb03b54414ac617e4f73c96e6639bf1b89111458f5d830387f0c51e2c5a5d6',
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                role: this.state.role,
            })
        }).catch(console.log)

        if (!response) return

        var data = await response.json().catch(console.log)

        if (!data.message) return

        this.props.changeValueOfmapTest("AA");
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
                    value={this.state.eMail}
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
        this.state = { host: "", user: "", password: "", db: "" };
        this.configureTheDatabase = this.configureTheDatabase.bind(this);
    }

    //TODO: Problem bei body 
    async configureTheDatabase() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/database", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer f1df51e1835233014368105514f07a70e9f2255b279e5535810d7fbf2d565cc1d692d8b06d53f6157423bb3c63b97e5a42adfbe6277e48dc028d8043683acca13b1b9f83773015ff5f3533e9ad08943bac2eb003f24fc3e6c910d2e83e69f39ec1d3e3ac98d4d2965312670810aab8ec152338654bcab32e7c82cbe83545b0b5f307feed1976239fbe2718c97abab76768e6dcdb3e243fcead76ef2bc2ca72045f748da22dee9881a3aefe0b18ce9dd6d34eb4032ed56e1cb4d8bf11d2ff0d663b65f3ee2b2da04af8bc3b0473c4046fdc53248905d3499955f635c6ed9bb7e2defb03b54414ac617e4f73c96e6639bf1b89111458f5d830387f0c51e2c5a5d6',
            },
            body: JSON.stringify({
                HOST: this.state.host,
                USER: this.state.user,
                PASSWORD: this.state.password,
                DB: this.state.db,
            })
        }).catch(console.log)

        if (!response) return

        var data = await response.json().catch(console.log)

        if (!data.message) return

        this.props.changeValueOfmapTest("DB");
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

    //TODO: Problem bei body ? 
    async configureTheMailserver() {
        var response = await fetch(Config.BACKEND_BASE_URI + "/setup/mailserver", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer f1df51e1835233014368105514f07a70e9f2255b279e5535810d7fbf2d565cc1d692d8b06d53f6157423bb3c63b97e5a42adfbe6277e48dc028d8043683acca13b1b9f83773015ff5f3533e9ad08943bac2eb003f24fc3e6c910d2e83e69f39ec1d3e3ac98d4d2965312670810aab8ec152338654bcab32e7c82cbe83545b0b5f307feed1976239fbe2718c97abab76768e6dcdb3e243fcead76ef2bc2ca72045f748da22dee9881a3aefe0b18ce9dd6d34eb4032ed56e1cb4d8bf11d2ff0d663b65f3ee2b2da04af8bc3b0473c4046fdc53248905d3499955f635c6ed9bb7e2defb03b54414ac617e4f73c96e6639bf1b89111458f5d830387f0c51e2c5a5d6',
            },
            body: JSON.stringify({
                HOST: this.state.host,
                PORT: this.state.port,
                SECURE: this.state.conncetion,
                USER: this.state.user,
                PASSWORD: this.state.password,
                DEFAULT_FROM: this.state.standardMail,
                DEFAULT_SUBJECT_PREFIX: this.state.standardPrefix,
            })
        }).catch(console.log)

        if (!response) return

        var data = await response.json().catch(console.log)

        if (!data.message) return

        this.props.changeValueOfmapTest("MS");
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
    }


    //FUNKTIONEN FÜR CSV-Reader

    //Eingelesene Daten entgegennehmen und in den State schreiben
    handleOnDrop = (data) => {
        var liste = [];
        console.log('---------------------------')
        console.log(data)
        console.log('---------------------------')

        data.forEach((data) => {
            console.log(data.data)
            liste.push(data.data)
        });

        this.setState({ listeEingelesen: true, initialeListe: liste })
    }

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }

    handleOnRemoveFile = (data) => {
        console.log('---------------------------')
        console.log(data)
        console.log('---------------------------')
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

class SystemInitalisierung extends React.Component {

    constructor(props) {
        super(props);
        this.changeStep = this.changeStep.bind(this);
        this.changeValueOfmapTest = this.changeValueOfmapTest.bind(this);
        this.state = {
            initializeStep: 0, mapTest: new Map([["AW", false], ["DB", false], ["MS", false], ["AL", false], ["AA", false]])
        };
    }
    // TODO: Step fürs Aufsetzen von Master-User mit Wallet
    // TODO: Step fürs Initialisieren der DB
    // TODO: Step fürs Aufladen des Backend-Wallets mit Ether...

    // Function to Change the Value of the state of Configuration
    changeValueOfmapTest(key) {
        this.setState(this.state.mapTest.set(key, true));
    }

    changeStep() {
        this.setState({ initializeStep: 1 + this.state.initializeStep });
    }

    render() {
        return (
            <Box className="SystemInitalisierung" direction="column" gap="medium" pad="medium" align="center">
                {this.state.initializeStep === 0 && <Hauptansicht mapTest={this.state.mapTest} initializeStep={this.state.initializeStep}></Hauptansicht>}
                {this.state.initializeStep === 1 && <ConfigureDatabase changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}></ConfigureDatabase>}
                {this.state.initializeStep === 2 && <ConfigureAdminAccount changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}></ConfigureAdminAccount>}
                {this.state.initializeStep === 3 && <ConfigureMailserver changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}></ConfigureMailserver>}
                {this.state.initializeStep === 4 && <AddWallet changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}></AddWallet>}
                {this.state.initializeStep === 5 && <AbsolventenListe changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}></AbsolventenListe>}
                {this.state.initializeStep === 6 && <Hauptansicht mapTest={this.state.mapTest} initializeStep={this.state.initializeStep}></Hauptansicht>}
                {this.state.initializeStep < 6 && <Button onClick={this.changeStep} label="Nächster Schritt"></Button>}
                {this.state.initializeStep === 6 && <Box pad="medium"> <Button label="Zurück"></Button> <Button label="Konfigurationen anzeigen"></Button></Box>}
            </Box>
        );
    }
}

export default SystemInitalisierung;
