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
            <Button label="System initalisieren"></Button>
        </Box>
        return Ansicht;
    }
}


class AddWallet extends React.Component {

    constructor(props) {
        super(props);
        this.state = { addresse: "", initialeListe: [] };
    }

    render() {
        var Ansicht = [];
        var Textbox = this.Example();
        Ansicht = <Box>
            <Text>Hinzufügen des Wallets für den Master-User:</Text>
            {Textbox};
            
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
        this.state = { initializeStep: 1, Ansicht: [], addresse: "" };
    }

    // TODO: Step fürs Aufsetzen von Master-User mit Wallet
    // TODO: Step fürs Initialisieren der DB
    // TODO: Step fürs Aufladen des Backend-Wallets mit Ether...

    loadView() {
        if (this.state.initializeStep === 0) {
            var Ansicht = [];
            Ansicht = <Hauptansicht></Hauptansicht>;
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

    Example() {
        const [value, setValue] = this.state.addresse;
        return (
          <TextInput
            placeholder="type here"
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        );
      }

    render() {
       var Ansicht = this.loadView();
       //{Ansicht}
        var Ansicht = this.Example();
        return (
            <Box className="SystemInitalisierung" direction="column" gap="medium" pad="medium" align="center">
                {Ansicht}
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
