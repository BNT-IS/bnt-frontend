import React from 'react';
import { Box, Button, TextInput, Text } from 'grommet';
import Web3 from 'web3';
import WalletLink from 'walletlink';
import Config from '../../config';

import UserContext from '../../AppContexts/UserContext'

class AccountManagement extends React.Component {

    constructor(props) {
        super(props);
        this.connectWallet = this.connectWallet.bind(this);
        this.createCoinbaseWallet = this.createCoinbaseWallet.bind(this);
        this.createUser = this.createUser.bind(this);
        this.otpBestätigen = this.otpBestätigen.bind(this);
        this.otpInputHandler = this.otpInputHandler.bind(this);
        this.setState1 = this.setState1.bind(this);
        this.setState6 = this.setState6.bind(this);
        this.sign = this.sign.bind(this);
        this.state = { otp: "", step: 0, access_token: "" , user:{ address: '' , email: '' , role: 1 , auth_token: this.getToken()}};
        this.tokenHandler = this.tokenHandler.bind(this);
        this.verifyAddress = this.verifyAddress.bind(this);
        this.walletLogin = this.walletLogin.bind(this);
        this.walletVerbinden = this.walletVerbinden.bind(this);
    }

    componentDidMount() {
        //Ruft die Initialisierung auf, nachdem die Komponente erstellt wurde
        this.init();
    }

    init() {
        //Initialisiere WalletLink
        const APP_NAME = 'DHBW Bachelors Night Ticketing - 2020'
        const APP_LOGO_URL = 'https://einfachtierisch.de/media/cache/article_teaser/cms/2015/09/Katze-lacht-in-die-Kamera-shutterstock-Foonia-76562038.jpg?595617'
        const ETH_JSONRPC_URL = Config.INFURA_URI
        const CHAIN_ID = 1

        this.setState({ walletAvailable: window.ethereum ? true : false });

        if (!window.ethereum) {
            this.walletLink = new WalletLink({
                appName: APP_NAME,
                appLogoUrl: APP_LOGO_URL,
                darkMode: false
            })

            window.ethereum = this.walletLink.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID);

        }
        this.setState({ connected: window.ethereum.selectedAddress ? true : false });

        this.web3 = new Web3(window.ethereum);
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

    createCoinbaseWallet() {
        //Öffnet eine neue Seite im Browser, welche Informationen zur Installation von Coinbase Wallet enthält
        window.open('https://wallet.coinbase.com/#signup', '_blank');
    }

    async connectWallet() {
        //Verbindet das aktuell ausgewählte Wallet mit der BA-Night Applikation
        var accounts = await window.ethereum.enable().catch(this.displayError)
        if (!accounts) return;

        console.log(`User's address is ${accounts[0]}`);
        this.setState({ connected: window.ethereum.selectedAddress ? true : false });
        this.setState({ step: 3 });
    }

    displayError() {
        //Wirft eine Standardfehlermeldung aus
        alert("Ups, das hat leider nicht funktioniert. Bitte versuchen Sie es erneut.")
    }

    async verifyAddress() {
        //Überprüft, ob das angegebene Wallet auch tatsächlich dem Benutzer gehört, indem eine Testsignatur an das Wallet gesendet wird, welche von diesem signiert werden muss.
        if (!window.ethereum) return this.displayError();
        if (!window.ethereum.selectedAddress) return this.displayError();
        var from = window.ethereum.selectedAddress;

        var testsignatur = 'Drei3333';
        var msg = this.web3.utils.stringToHex(testsignatur);

        var params = [msg, from]
        var method = 'personal_sign'

        this.web3.currentProvider.send({
            method,
            params,
            from,
        }, (err, result) => {
            if (err) return console.error(err)
            if (result.error) return console.error(result.error)

            console.log(result);

            var recovered = this.web3.eth.accounts.recover(msg, result.result);
            if (recovered.toLowerCase() === from.toLowerCase()) {
                alert('Successfully ecRecovered signer as ' + from)
                this.setState({ step: 4 })
            } else {
                alert('Failed to verify signer when comparing ' + recovered + ' to ' + from)
            }
        })
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

    async walletLogin() {
        //Versucht, den User mit der ausgewählten Walletadresse anzumelden. Funktioniert nur, sofern für die Walletadresse ein Nutzer angelegt ist.
        const response = await fetch(Config.BACKEND_BASE_URI + "/auth/login", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: window.ethereum.selectedAddress })
        }).catch(console.log);

        if (!response) {
            alert("Beim Login ihres Wallets ist ein Fehler aufgetreten. Bitte stellen Sie sicher, dass das richtige Wallet ausgewählt wurde.");
            return;
        }

        const data = await response.json().catch(console.log);
        console.log(data);
        if (!data.challenge) {
            alert("Ihre aktuelle Ethereum Adresse ist uns nicht bekannt. Möglicherweise haben Sie noch kein Konto bei uns!")
        } else {
            this.sign(data.challenge);
        }
    }

    async sign(challengeString) {
        //Sendet eine Challenge an die angegebene Walletadresse, welche signiert werden muss. Aus dieser Challenge wird ein Token generiert und im LocalStorage gespeichert.
        if (!window.ethereum) return this.displayError();
        if (!window.ethereum.selectedAddress) return this.displayError();
        var from = window.ethereum.selectedAddress;

        var text = challengeString;
        var msg = this.web3.utils.stringToHex(text);

        var params = [msg, from]
        var method = 'personal_sign'

        this.web3.currentProvider.send({
            method,
            params,
            from,
        }, async (err, result) => {
            if (err) return console.error(err)
            if (result.error) return console.error(result.error)

            console.log(result); //result = Ergebnis des Blockchain-Aufrufs

            const response = await fetch(Config.BACKEND_BASE_URI + '/auth/chr/' + challengeString, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: from, signature: result.result })
            }).catch(console.log);

            if (!response) {
                alert("Für die signierte Challenge wurde kein Benutzer gefunden.");
                return;
            }
            console.log(response)
            //Nur Javascript Response Object
            var jsResponse = await response.json().catch(console.log);

            console.log(jsResponse)
            if (!jsResponse) return;

            this.setToken(jsResponse.token);

        })
    }

    setState1() {
        //Springt zur Eingabe des OTP's im Erstellungsprozess
        this.setState({ step: 1 });
    }

    setState6() {
        //Springt zur Anmeldung mit einem vorhandenen Wallet
        this.setState({ step: 6 });
    }

    async walletVerbinden() {
        //Verbindet ein vorhandenes Wallet mit der BA-Night Applikation und springt zur Anmeldung mit einem vorhandenen Wallet
        var accounts = await window.ethereum.enable().catch(this.displayError)
        if (!accounts) return;

        console.log(`User's address is ${accounts[0]}`);
        this.setState({ connected: window.ethereum.selectedAddress ? true : false });
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