import React from 'react';
import { Box, Button, TextInput, Text } from 'grommet';
import Web3 from 'web3';
import Config from '../../config';

import UserContext from '../../AppContexts/UserContext'

class AccountManagement extends React.Component {

    constructor(props) {
        super(props);
        this.createUser = this.createUser.bind(this);
        this.otpBestätigen = this.otpBestätigen.bind(this);
        this.otpInputHandler = this.otpInputHandler.bind(this);
        this.setState1 = this.setState1.bind(this);
        this.setState6 = this.setState6.bind(this);
        this.state = { otp: "", step: 0, access_token: "" };
        this.tokenHandler = this.tokenHandler.bind(this);
    }

    componentDidMount() {
        //Ruft die Initialisierung auf, nachdem die Komponente erstellt wurde
        this.init();
    }

    init() {
        
    }

    otpInputHandler(event) {
        //Liest das eingegebene OTP aus dem Input-Feld aus und speichert es zwischen
        this.setState({ otp: event.target.value });
    }

    tokenHandler(event) {
        //Liest den eingegebenen Token aus dem Input-Feld aus und speichert diesen zwischen
        this.setState({ access_token: event.target.value });
    }

    otpBestätigen() {
        //Gibt das OTP aus und springt zum nächsten Schritt
        console.log(this.state.otp);
        this.setState({ step: 2 });
    }

    displayError() {
        //Wirft eine Standardfehlermeldung aus
        alert("Ups, das hat leider nicht funktioniert. Bitte versuchen Sie es erneut.")
    }

    async createUser() {
        //Legt anhand des eingegebenen OTP's einen User mit der ausgewählten Walletadresse an
        const response = await fetch(Config.BACKEND_BASE_URI + '/auth/otpcreate/' + this.state.otp, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: window.ethereum.selectedAddress })
        }).catch(console.log);

        if (!response) {
            alert("Für das eingegebene OTP konnte kein User angelegt werden.");
            return;
        }

        const test = await response.json().catch(console.log);

        console.log(test);
        alert("Der Nutzer wurde erfolgreich angelegt.");
        this.setState({ step: 5 });
    }

    setState1() {
        //Springt zur Eingabe des OTP's im Erstellungsprozess
        this.setState({ step: 1 });
    }

    setState6() {
        //Springt zur Anmeldung mit einem vorhandenen Wallet
        this.setState({ step: 6 });
    }

    // @Robin: Für globale Autentifizierung: https://reactjs.org/docs/context.html React context...
    // Könnte ganz praktisch sein.. Habe ich ausprobiert mit App.js und Ticketshop -> Siehe also dort mal nach
    // Überlege doch mal, ob du die Logik so auslagern kannst, dass irgendwie global überprüft wird, ob ein Token verfügbar ist, ob dieser funktioniert und, ob das Wallet verbunden ist.
    // Bsp.: 1. Checke ob access_token verfügbar ist 
    // 2. Überprüfe, ob das Wallet verfügbar, verbunden und ob du die selectedAddress abrufen kannst. 
    // 3. Checke, ob der access_token funktioniert, indem du die User-Daten von der GET /users/:address abrufst.
    // Wenn irgendwas davon nicht geht/ schiefgeht, ist der User nicht eingeloggt und du müsstest auf eine Login-Route im Frontend weiterleiten...
    setToken(access_token) {
        //Schreibt einen Token in den LocalStorage des Browsers
        localStorage.setItem('access_token', access_token);
    }

    getToken() {
        //Liest einen Token aus dem LocalStorage des Browsers aus
        return localStorage.getItem('access_token');
    }


    render() {
        //Stellt die jeweiligen Schritte für den Benutzer dar
        return (
            <Box className="AccountManagement" pad="medium" gap="small">
                {this.state.step === 0 &&
                //Startseite des Accountmanagements, Auswahl zwischen Neuanlage eines Áccounts und Anmeldung mit einem bestehenden Account
                    <Box gap="small">
                        <Text>Klicke hier, um einen neuen Account anzulegen</Text>
                        <Button label="Neuen Account anlegen" gap="small" onClick={this.setState1}></Button>
                        <Text>Klicke hier, um dich mit einem bestehenden Account anzumelden</Text>
                        <Button label="Mit bestehendem Account anmelden" onClick={this.setState6}></Button>
                    </Box>
                }
                {this.state.step === 1 &&
                //Eingabe des persönlichen OTP's
                    <Box gap="small">
                        <Text>Bitte geben Sie das OneTime-Passwort ein und bestätigen Sie die Eingabe</Text>
                        <TextInput placeholder="OTP eingeben" value={this.state.otp} onChange={this.otpInputHandler}></TextInput>
                        <Button label="Eingabe bestätigen" onClick={this.otpBestätigen}></Button>
                    </Box>
                }
                {this.state.step === 2 &&
                //Aufruf zur Erstellung eines Wallets, falls keines verfügbar. Aufruf zur Verbindung des Wallets mit der BA-Night Applikation durch Scannen des QR-Codes durch das Wallet.
                    <Box classname="WalletSetup" direction="column" gap="small">
                        <h1>Wallet Setup</h1>
                        <Text>Um Tickets zu erwerben benötigen Sie ein sogenanntes Wallet. Dieses ist vergleichbar mit Ihrer Geldbörse zu der nur Sie Zugriff haben.</Text>
                        {(!this.state.walletAvailable && !this.state.connected) &&
                            <Box gap="small">
                                <Button label="Wallet auf dem Smartphone erstellen" onClick={this.createCoinbaseWallet}></Button>
                            </Box>
                        }
                        {(!this.state.connected) &&
                            <Box gap="small">
                                <Text>Als Nächstes benötigt unsere Plattform die Addresse Ihres Wallets. Bitte bestätigen Sie daher die Verbindung mit Ihrem Wallet über folgende Schaltfläche.Sie geben dadurch <b>nicht</b> Ihre Kontrolle über das Wallet ab!
                            Nach einem Klick auf den Button muss mit Coinbase Wallet der angezeigte QR-Code eingescannt werden, um das Wallet zu überprüfen.</Text>
                                <Button label="Mit vorhandenem Wallet anmelden" onClick={this.connectWallet}></Button>
                            </Box>
                        }
                        {(this.state.walletAvailable && this.state.connected) &&
                            <div className="Adresse verifizieren">
                                {this.verifyAddress()&& ""}
                            </div>
                        }
                    </Box>
                }
                {this.state.step === 3 &&
                //Sendet eine Testsignatur an das verbundene Wallet, um zu überprüfen, ob das angegebene Wallet auch dem Benutzer gehört
                    <Box gap="small">
                        <Text>Ein Wallet wurde erfolgreich verbunden. Das Wallet muss anhand einer Testsignatur überprüft werden.</Text>
                        <Button label="Führe Testsignatur aus" onClick={this.verifyAddress}></Button>
                    </Box>
                }
                {this.state.step === 4 &&
                //Erstellt einen neuen User mit dem angegebenen OTP und der ausgewählten Walletadresse
                    <Box gap="small">
                        <div classname="User erstellen">
                        {this.createUser() && ""}
                        </div>
                    </Box>
                }
                {this.state.step === 5 &&
                //Springt zur Anmeldung mit einem vorhandenen Wallet
                    <Box gap="small">
                        <div classname="Anmeldung mit Wallet">
                        {this.setState6() &&""}
                        </div>
                    </Box>
                }
                {this.state.step === 6 &&
                //Anmeldung mit einem vorhandenen Coinbase-Wallet
                    <Box gap="small">
                        <h1>Anmeldung mit einem vorhandenen Coinbase-Wallet</h1>
                        {(!this.state.walletAvailable && !this.state.connected) &&
                            <Box gap="small">
                                <Text>Es ist kein Wallet verfügbar. Bitte erstellen Sie ein Coinbase-Wallet und verbinden Sie dieses.</Text> 
                                <Button label="Wallet erstellen" onClick={this.createCoinbaseWallet}></Button>
                            </Box>
                        }
                        {(!this.state.connected) &&
                            <Box gap="small">
                                <Text>Ihr Coinbase-Wallet scheint nicht verbunden zu sein. Bitte bestätigen Sie die Verbindung mit Ihrem Wallet im nächsten Schritt.</Text>
                                <Button label="Wallet verbinden" onClick={this.walletVerbinden}></Button>
                            </Box>
                        }
                        {(this.state.walletAvailable && this.state.connected) &&
                            <Box gap="small">
                                <Text>Ein Coinbase-Wallet ist vorhanden und verbunden. Die Anmeldung ist möglich. Bitte bestätigen ("unterschreiben") Sie die nächste Anfrage Ihres Wallets, damit wir Ihre Identität überprüfen können.</Text>
                                <Button label="Anmeldung starten" onClick={this.walletLogin}></Button>
                            </Box>
                        }
                    </Box>
                }
                {this.state.step === 888 &&
                //Test-Seite für verschiedene Funktionen, welche im Standard-Prozess nicht aufgerufen wird
                    <Box gap="small">
                        <h1>Willkommen bei Virgil's Testgelände</h1>
                        <TextInput placeholder="Test-Token eingeben" value={this.state.access_token} onChange={this.tokenHandler}></TextInput>
                        <Button label="Eingabe bestätigen" onClick={() => { this.setToken(this.state.access_token) }}></Button>
                    </Box>
                }
            </Box>
        );
    }
}
export default AccountManagement;