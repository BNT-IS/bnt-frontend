import React from 'react';
//import './TicketOverview.css';
import { Box, Button, Accordion, AccordionPanel, Select, Text, List, TextInput } from 'grommet';

class InitialeListeEinlesen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { listeEingelesen: false, initialeListe: [] };
    }

    render() {
        if (!this.state.ListeEingelesen);
        return;
    }

}

class Hauptansicht extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.getConfigured = this.getConfigured.bind(this);
    }
    getConfigured(Number) {
        if (!this.props.configured[Number])
            return "Nicht erledigt";
        if (this.props.configured[Number])
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
                    { initializeStep: <Text weight="normal">Hinzufügen eines Wallets für den Master-User</Text>, doneSteps: this.getConfigured(0) },
                    { initializeStep: <Text weight="normal">Initalisieren der Datenbank</Text>, doneSteps: this.getConfigured(1) },
                    { initializeStep: <Text weight="normal">Hinzufügen von Ether zu dem Wallet für den Master-User</Text>, doneSteps: this.getConfigured(2) },
                    { initializeStep: <Text weight="normal">Einlesen der Absolventen-Liste und Erstellung der One Time Passwörter</Text>, doneSteps: this.getConfigured(3) },
                ]}
            />
        </Box>
        return Ansicht;
    }
}


class AddWallet extends React.Component {

    constructor(props) {
        super(props);
        this.state = { addresse: "", initialeListe: [], textInput: "" };
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
        </Box>
        return Ansicht;
    }
}

class ConfigureDatabase extends React.Component {

    constructor(props) {
        super(props);
        this.state = { host: "", user: "", password: "", db: "", };
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
        </Box>
        return Ansicht;
    }
}

class ConfigureMailserver extends React.Component {

    constructor(props) {
        super(props);
        this.state = { host: "", port: Number, conncetion: Boolean, user: "", password: "", standardMail: "", standardPrefix: "" };
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
                placeholder="Hier bitte die Standard Prefix eingeben"
                value={this.state.standardPrefix}
                onChange={(event) => { this.setState({ standardPrefix: event.target.value }) }}
            />
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
        </Box>
        return Ansicht;
    }
}

class SystemInitalisierung extends React.Component {

    constructor(props) {
        super(props);
        this.changeStep = this.changeStep.bind(this);
        this.state = { initializeStep: 0, datenbank: [], mailServer: [], configured: [false, false, false, false] };
    }
    // TODO: Step fürs Aufsetzen von Master-User mit Wallet
    // TODO: Step fürs Initialisieren der DB
    // TODO: Step fürs Aufladen des Backend-Wallets mit Ether...

    // Funktion für Button - Zählt InitializeStep eine Nummer hoch und setzt ab InitializeStep = 1 -> Counter = 0 die Werte für Configured auf True
    changeStep() {
        var counter = this.state.initializeStep - 1;
        var array = this.state.configured;
        array[counter] = true;
        counter++;
        this.setState({ configured: array })
        this.setState({ initializeStep: ++this.state.initializeStep });
    }

    render() {
        return (
            <Box className="SystemInitalisierung" direction="column" gap="medium" pad="medium" align="center">
                {this.state.initializeStep === 0 && <Hauptansicht configured={this.state.configured}></Hauptansicht>}
                {this.state.initializeStep === 1 && <AddWallet></AddWallet>}
                {this.state.initializeStep === 2 && <ConfigureDatabase></ConfigureDatabase>}
                {this.state.initializeStep === 3 && <ConfigureMailserver></ConfigureMailserver>}
                {this.state.initializeStep === 4 && <AbsolventenListe></AbsolventenListe>}
                {this.state.initializeStep === 5 && <Hauptansicht configured={this.state.configured}></Hauptansicht>}
                {this.state.initializeStep < 5 && <Button onClick={this.changeStep} label="Nächster Schritt"></Button>}
                {this.state.initializeStep === 5 && <Box> <Button label="Zurück"></Button><Button label="Konfigurationen anzeigen"></Button></Box>}
            </Box>
        );
    }
}

export default SystemInitalisierung;
