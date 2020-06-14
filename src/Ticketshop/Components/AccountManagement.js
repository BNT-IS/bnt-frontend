import React from 'react';
import { Box, Button, TextInput, Text } from 'grommet';
import Web3 from 'web3';
import WalletLink from 'walletlink';
import Config from '../../config';


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
        this.state = { otp: "", step: 0, Token: "" }; // @Robin Camelcase! -> Token -> token
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
        const APP_NAME = 'DHBW Bachelors Night Ticketing - 2020'
        const APP_LOGO_URL = 'https://einfachtierisch.de/media/cache/article_teaser/cms/2015/09/Katze-lacht-in-die-Kamera-shutterstock-Foonia-76562038.jpg?595617'
        const ETH_JSONRPC_URL = Config.INFURA_URI
        const CHAIN_ID = 1

        this.setState({ walletAvailable: window.ethereum ? true : false });

        if (!window.ethereum) {
            //Initialisiere WalletLink
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
        this.setState({ otp: event.target.value });
    }

    tokenHandler(event) {
        this.setState({ Token: event.target.value });
    }

    otpBestätigen() {
        console.log(this.state.otp);
        this.setState({ step: 2 });
    }

    createCoinbaseWallet() {
        window.open('https://wallet.coinbase.com/#signup', '_blank');
    }

    async connectWallet() {
        var accounts = await window.ethereum.enable().catch(this.displayError)
        if (!accounts) return;

        console.log(`User's address is ${accounts[0]}`);
        this.setState({ connected: true });
        this.setState({ step: 3 });
    }

    displayError() {
        alert("Ups, das hat leider nicht funktioniert. Bitte versuchen Sie es erneut.")
    }

    async verifyAddress() {
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
        const response = await fetch(Config.BACKEND_BASE_URI + '/auth/otpcreate/' + this.state.otp, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: window.ethereum.selectedAddress })
        }).catch(console.log);

        if (!response) {
            alert("Fehler"); // @Robin Bisschen aussagekräftiger sollte das dann für den User schon sein ;)
            return;
        }

        const test = await response.json().catch(console.log);

        console.log(test);
        this.setState({ step: 5 });
    }

    async walletLogin() {

        const response = await fetch(Config.BACKEND_BASE_URI + "/auth/login", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: window.ethereum.selectedAddress })
        }).catch(console.log);

        if (!response) {
            alert("Fehler!"); // @Robin Bisschen aussagekräftiger sollte das dann für den User schon sein ;)
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
            //Mit dem Result weiterrechnen, um Token auszugeben
            //Hier muss dann noch eine "Login-Funktion" ausgeführt werden.

            const response = await fetch(Config.BACKEND_BASE_URI + '/auth/chr/' + challengeString, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address: from, signature: result.result })
            }).catch(console.log);

            if (!response) {
                alert("Fehler"); // @Robin Bisschen aussagekräftiger sollte das dann für den User schon sein ;)
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
        this.setState({ step: 1 });
    }

    setState6() {
        this.setState({ step: 6 });
    }

    async walletVerbinden() {
        var accounts = await window.ethereum.enable().catch(this.displayError)
        if (!accounts) return;

        console.log(`User's address is ${accounts[0]}`);
        this.setState({ connected: true });
        this.setState({ step: 6 });
    }

    // @Robin: Für globale Autentifizierung: https://reactjs.org/docs/context.html React context...
    // Könnte ganz praktisch sein.. Habe ich ausprobiert mit App.js und Ticketshop -> Siehe also dort mal nach
    // Überlege doch mal, ob du die Logik so auslagern kannst, dass irgendwie global überprüft wird, ob ein Token verfügbar ist, ob dieser funktioniert und, ob das Wallet verbunden ist.
    // Bsp.: 1. Checke ob access_token verfügbar ist 
    // 2. Überprüfe, ob das Wallet verfügbar, verbunden und ob du die selectedAddress abrufen kannst. 
    // 3. Checke, ob der access_token funktioniert, indem du die User-Daten von der GET /users/:address abrufst.
    // Wenn irgendwas davon nicht geht/ schiefgeht, ist der User nicht eingeloggt und du müsstest auf eine Login-Route im Frontend weiterleiten...
    setToken(Token) {
        localStorage.setItem('access_token', Token);
    }

    getToken() {
        return localStorage.getItem('access_token');
    }


    render() {
        return (
            <Box className="AccountManagement" pad="medium" gap="small">
                {this.state.step === 0 &&
                    <Box gap="small">
                        <Text>Klicke hier, um einen neuen Account anzulegen</Text>
                        <Button label="Neuen Account anlegen" gap="small" onClick={this.setState1}></Button>
                        <Text>Klicke hier, um dich mit einem bestehenden Account anzumelden</Text>
                        <Button label="Mit bestehendem Account anmelden" onClick={this.setState6}></Button>
                    </Box>
                }
                {this.state.step === 1 &&
                    <Box gap="small">
                        <Text>Bitte geben Sie das OneTime-Passwort ein und bestätigen Sie die Eingabe</Text>
                        <TextInput placeholder="OTP eingeben" value={this.state.otp} onChange={this.otpInputHandler}></TextInput>
                        <Button label="Eingabe bestätigen" onClick={this.otpBestätigen}></Button>
                    </Box>
                }
                {this.state.step === 2 &&
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
                                {this.verifyAddress}
                            </div>
                        }
                    </Box>
                }
                {this.state.step === 3 &&
                    <Box gap="small">
                        <Text>Ein Wallet wurde erfolgreich verbunden. Das Wallet muss anhand einer Testsignatur überprüft werden.</Text>
                        <Button label="Führe Testsignatur aus" onClick={this.verifyAddress}></Button>
                    </Box>
                }
                {this.state.step === 4 &&
                    <Box gap="small">
                        <Text>Klicke auf den Button, um einen Benutzer zu erstellen.</Text>
                        <Button label="Benutzer erstellen" onClick={this.createUser}></Button>
                    </Box>
                }
                {this.state.step === 5 &&
                    <Box gap="small">
                        <Text>Der Benutzer wurde erfolgreich angelegt. Klicke auf den Button, um zur Anmeldung zu gelangen. </Text>
                        <Button label="Zur Anmeldung" onClick={this.setState6}></Button>
                    </Box>
                }
                {this.state.step === 6 &&
                    <Box gap="small">
                        <h1>Anmeldung mit einem vorhandenen Wallet</h1>
                        {(!this.state.walletAvailable && !this.state.connected) &&
                            <Box gap="small">
                            { // @Robin eventuell Bescheid geben, dass es sich hier explizit um das Coinbase Wallet handelt, da dieses bequem auf dem Smartphone installiert werden kann und dann drahtlos funktioniert.
                            // Alternativ ist ein Wallet im Browser erforderlich...sowas wie MetaMask. 
                                // Stell dir vor, wie der Dümmste User davor steht und sich fragt, warum jetzt aufeinmal Coinbase?!
                                // Also einfach vielleicht mehr Infos hier...
                            
                            }
                                <Text>Es ist kein Wallet verfügbar. Bitte erstellen Sie ein Wallet und verbinden Sie dieses.</Text> 
                                <Button label="Wallet erstellen" onClick={this.createCoinbaseWallet}></Button>
                            </Box>
                        }
                        {(!this.state.connected) &&
                            <Box gap="small">
                                <Text>Ihr Wallet scheint nicht verbunden zu sein. Bitte bestätigen Sie die Verbindung mit Ihrem Wallet im nächsten Schritt.</Text>
                                <Button label="Wallet verbinden" onClick={this.walletVerbinden}></Button>
                            </Box>
                        }
                        {(this.state.connected) &&
                            <Box gap="small">
                                <Text>Ein Wallet ist vorhanden und verbunden. Die Anmeldung ist möglich. Bitte bestätigen ("unterschreiben") Sie die nächste Anfrage Ihres Wallets, damit wir Ihre Identität überprüfen können.</Text>
                                <Button label="Anmeldung starten" onClick={this.walletLogin}></Button>
                            </Box>
                        }
                    </Box>
                }
                {this.state.step === 888 &&
                    <Box gap="small">
                        <h1>Willkommen bei Barry's Testgelände</h1>
                        <TextInput placeholder="Test-Token eingeben" value={this.state.Token} onChange={this.tokenHandler}></TextInput>
                        <Button label="Test" onClick={() => { this.setToken(this.state.Token) }}></Button>
                    </Box>
                }
            </Box>
        );
    }
}
export default AccountManagement;