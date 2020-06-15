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
        this.onClickHandler = this.onClickHandler.bind(this);
        this.state = {};
    }

    onClickHandler() {
        this.props.onStartInitializing(1);
    }

    render() {
        var Ansicht = []
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
                    { initializeStep: 'Vorbereitsungsschritt', doneSteps: 'Erledigt' },
                    { initializeStep: 'Hinzufügen eines Wallets für den Master-User', doneSteps: 'false' },
                    { initializeStep: 'Initalisieren der Datenbank', doneSteps: 'false' },
                    { initializeStep: 'Hinzufügen von Ether zu dem Wallet für den Master-User', doneSteps: 'false' },
                    { initializeStep: 'Einlesen der Absolventen-Liste und Erstellung der One Time Passwörter', doneSteps: 'false' },
                ]}
            />
            <Button label="System initalisieren" onClick={this.onClickHandler}></Button>
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
        //var Textbox = this.Example();
        Ansicht = <Box>
            <Text>Hinzufügen des Wallets für den Master-User:</Text>
            <TextInput
                placeholder="Test"
                value={this.state.textInput}
                onChange={(event) => {this.setState({textInput: event.target.value}) }}
            />
        </Box>
        return Ansicht;
    }
}

class ConfigureDatabase extends React.Component {

    constructor(props) {
        super(props);
        this.state = { listeEingelesen: false, initialeListe: [] };
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>Hallo wie geht es uns heute


                    </Box>
        return Ansicht;
    }
}

class ConfigureMailserver extends React.Component {

    constructor(props) {
        super(props);
        this.state = { listeEingelesen: false, initialeListe: [] };
    }

    render() {
        var Ansicht = [];
        Ansicht = <Box>Hallo wie geht es uns heute</Box>
        return Ansicht;
    }
}

class SystemInitalisierung extends React.Component {

    constructor(props) {
        super(props);
        this.changeStep = this.changeStep.bind(this);
        this.state = { initializeStep: 0, Ansicht: [], addresse: "" };
    }

    // TODO: Step fürs Aufsetzen von Master-User mit Wallet
    // TODO: Step fürs Initialisieren der DB
    // TODO: Step fürs Aufladen des Backend-Wallets mit Ether...

    changeStep() {
        this.setState({ initializeStep: ++this.state.initializeStep });
    }

    loadView() {
        if (this.state.initializeStep === 0) {
            var Ansicht = [];
            Ansicht = <Hauptansicht onStartInitializing={this.changeStep} ></Hauptansicht>;
            return Ansicht;
        }

        if (this.state.initializeStep === 1) {
            var Ansicht = [];
            Ansicht = <AddWallet></AddWallet>
            return Ansicht;
        }

        if (this.state.initializeStep === 2) {
            var Ansicht = [];
            Ansicht = <ConfigureDatabase></ConfigureDatabase>
            return Ansicht;
        }

        if (this.state.initializeStep === 3) {
            var Ansicht = [];
            Ansicht = <ConfigureMailserver></ConfigureMailserver>
            return Ansicht;
        }
    }

    render() {
        var Ansicht = this.loadView();
        //{Ansicht}
        //var Ansicht = this.Example();
        return (
            <Box className="SystemInitalisierung" direction="column" gap="medium" pad="medium" align="center">
                {this.state.initializeStep === 0 && <Hauptansicht onStartInitializing={this.changeStep} ></Hauptansicht>}
                {this.state.initializeStep === 1 && <AddWallet></AddWallet>}
                <Button onClick={this.changeStep} label="TEst"></Button>
                <Box className="Auswahlmenü">
                    <Select
                        options={['CSV', 'XLSX']}
                        value={this.state.dateiTyp}
                        onChange={({ value, option }) => { this.setState({ dateiTyp: option }) }}
                    />
                </Box>
            </Box>

        );
    }
}

export default SystemInitalisierung;
