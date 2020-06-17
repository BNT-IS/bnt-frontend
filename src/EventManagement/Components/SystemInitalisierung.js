import React from 'react';
//import './TicketOverview.css';
import { Box, Button, Accordion, AccordionPanel, Select, Text, List, TextInput } from 'grommet';
import Config from '../../config';

class Hauptansicht extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.getConfigured = this.getConfigured.bind(this);
    }

    getConfigured(key) {
        var wert = this.props.mapTest.get(key);
        if (!wert)
            return "Nicht erledigt";
        if (wert)
            return "Erledigt"
    }

    render() {
        var Ansicht = [];
        Ansicht[0] = <Box>
            <Text textAlign="center">
                Guten Tag und Herzlich Wilkommen zum Ticketsystem.
                Die nächsten Schritte dienen zur Initalisierung des Systems.
                Sie werden durch die notwendigen Vorbereitungsschritte geführt.
                Für die Initalisierung sind folgende Schritte notwendig:
            </Text>
            <List
                primaryKey="initializeStep"
                secondaryKey="doneSteps"
                data={[
                    { initializeStep: <Text size="large" weight="bold">Vorbereitsungsschritt</Text>, doneSteps: <Text size="large" weight="bold">Zustand</Text> },
                    { initializeStep: <Text weight="normal">Hinzufügen eines Wallets für den Master-User</Text>, doneSteps: this.getConfigured("AW") },
                    { initializeStep: <Text weight="normal">Initalisieren der Datenbank</Text>, doneSteps: this.getConfigured("DB") },
                    { initializeStep: <Text weight="normal">Hinzufügen von Ether zu dem Wallet für den Master-User</Text>, doneSteps: this.getConfigured("MS") },
                    { initializeStep: <Text weight="normal">Einlesen der Absolventen-Liste und Erstellung der One Time Passwörter</Text>, doneSteps: this.getConfigured("AL") },
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
            <Text size="large" weight="bold">Hinzufügen des Wallets für den Master-User:</Text>
            <TextInput
                placeholder="Test"
                value={this.state.textInput}
                onChange={(event) => { this.setState({ textInput: event.target.value }) }}
            />
            <Button onClick={this.setValueTrue} label="Hinzufügen"></Button>
        </Box>
        return Ansicht;
    }
}

class ConfigureDatabase extends React.Component {

    constructor(props) {
        super(props);
        this.state = { host: "", user: "", password: "", db: "" };
    }

    //TODO: CONFIUGRE DATABASE ANPASSEN AUF URI 
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
            <Text size="large" weight="bold">Konfigurieren der Datenbank:</Text>
            <Box>Datenbank-Host:
                <TextInput
                    placeholder="Hier bitte den Datenbank-Host eingeben"
                    value={this.state.host}
                    onChange={(event) => { this.setState({ host: event.target.value }) }}
                /></Box>
            <Box>Datenbank-Host:
                <TextInput
                    placeholder="Hier bitte den Datenbank-Host eingeben"
                    value={this.state.host}
                    onChange={(event) => { this.setState({ host: event.target.value }) }}
                /></Box>
            Benutzer:
            <TextInput
                placeholder="Hier bitte den Benutzer eingeben"
                value={this.state.user}
                onChange={(event) => { this.setState({ user: event.target.value }) }}
            />
            Passwort:
            <TextInput
                placeholder="Hier bitte das Passwort eingeben"
                value={this.state.password}
                onChange={(event) => { this.setState({ password: event.target.value }) }}
            />
            Datenbank:
            <TextInput
                placeholder="ier bitte die Datenbank eingeben"
                value={this.state.db}
                onChange={(event) => { this.setState({ db: event.target.value }) }}
            />
            <Button onClick={this.configureTheDatabase} label="Abschließen"></Button>
        </Box>
        return Ansicht;
    }
}

class ConfigureMailserver extends React.Component {

    constructor(props) {
        super(props);
        this.state = { host: "", port: Number, conncetion: Boolean, user: "", password: "", standardMail: "", standardPrefix: "" };
    }

    //TODO: CONFIUGRE MAILSERVER ANPASSEN AUF URI 
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
            Mailserver-Host:
            <TextInput
                placeholder="Hier bitte den Mailserver-Host eingeben"
                value={this.state.textInput}
                onChange={(event) => { this.setState({ host: event.target.value }) }}
            />
            Port:
            <TextInput
                placeholder="Hier bitte den Port eingeben"
                value={this.state.port}
                onChange
                ={(event) => { this.setState({ port: event.target.value }) }}
            />
            Sichere Verbindung:
            <Select
                options={['true', 'false']}
                value={this.state.conncetion}
                onChange={({ value, option }) => { this.setState({ conncetion: option }) }}
            />
            Benutzer:
            <TextInput
                placeholder="Hier bitte den Benutzer eingeben"
                value={this.state.user}
                onChange={(event) => { this.setState({ user: event.target.value }) }}
            />
            Passwort:
            <TextInput
                placeholder="Hier bitte das Passwort eingeben"
                value={this.state.password}
                onChange={(event) => { this.setState({ password: event.target.value }) }}
            />
            Standard Mail:
            <TextInput
                placeholder="Hier bitte die Standard Mail eingeben"
                value={this.state.standardMail}
                onChange={(event) => { this.setState({ standardMail: event.target.value }) }}
            />
           Standard Subject Prefix:
            <TextInput
                placeholder="Hier bitte den Standard Prefix eingeben"
                value={this.state.standardPrefix}
                onChange={(event) => { this.setState({ standardPrefix: event.target.value }) }}
            />
            <Button onClick={this.configureTheMailserver} label="Abschließen"></Button>
        </Box>
        return Ansicht;
        //TODO STANDARD (????)
    }
}

class AbsolventenListe extends React.Component {

    constructor(props) {
        super(props);
        this.state = { listeEingelesen: false, initialeListe: [], dateiTyp: "CSV" };
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

        this.props.changeValueOfmapTest("AL");
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>
            <Text size="large" weight="bold">Einlesen der Absolventen Liste</Text>
            <Box className="Auswahlmenü">
                <Select
                    options={['CSV', 'XLSX']}
                    value={this.state.dateiTyp}
                    onChange={({ value, option }) => { this.setState({ dateiTyp: option }) }}
                />
            </Box>
            <Button onClick={this.useListAndSendMail} label="Abschließen"></Button>
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
            initializeStep: 0, mapTest: new Map([["AW", false], ["DB", false], ["MS", false], ["AL", false]])
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
        this.setState({ initializeStep: ++this.state.initializeStep });
    }

    render() {
        return (
            <Box className="SystemInitalisierung" direction="column" gap="medium" pad="medium" align="center">
                {this.state.initializeStep === 0 && <Hauptansicht mapTest={this.state.mapTest}></Hauptansicht>}
                {this.state.initializeStep === 1 && <AddWallet changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}></AddWallet>}
                {this.state.initializeStep === 2 && <ConfigureDatabase changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}></ConfigureDatabase>}
                {this.state.initializeStep === 3 && <ConfigureMailserver changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}></ConfigureMailserver>}
                {this.state.initializeStep === 4 && <AbsolventenListe changeValueOfmapTest={this.changeValueOfmapTest.bind(this)}></AbsolventenListe>}
                {this.state.initializeStep === 5 && <Hauptansicht mapTest={this.state.mapTest}></Hauptansicht>}
                {this.state.initializeStep < 5 && <Button onClick={this.changeStep} label="Nächster Schritt"></Button>}
                {this.state.initializeStep === 5 && <Box> <Button label="Zurück"></Button><Button label="Konfigurationen anzeigen"></Button></Box>}
            </Box>
        );
    }
}

export default SystemInitalisierung;
