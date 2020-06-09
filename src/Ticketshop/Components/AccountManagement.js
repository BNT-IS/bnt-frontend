import React from 'react';
import { Box, Button, TextInput, Text } from 'grommet';
import Web3 from 'web3';
import WalletLink from 'walletlink';

class AccountManagement extends React.Component {

    constructor(props) {
        super(props);
        this.otpInputHandler = this.otpInputHandler.bind(this);
        this.accountAnlegenHandler = this.accountAnlegenHandler.bind(this);
        this.ansichtAccountAnlegen = this.ansichtAccountAnlegen.bind(this);
        this.connectWallet = this.connectWallet.bind(this);
        this.linkToCreateCoinbaseWallet = this.linkToCreateCoinbaseWallet.bind(this);
        this.signaturÜberprüfen = this.signaturÜberprüfen.bind(this);
        this.sign = this.sign.bind(this);
        this.walletLogin = this.walletLogin.bind(this);
        this.walletVerifizieren = this.walletVerifizieren.bind(this);
        this.state = { otp: "", step: 0 };
        this.sampleArray = ["12345", "67891", "23456", "78912", "34567", "89123", "45678", "91234", "56789"];

    }

    componentDidMount() {
        //Ruft die Initialisierung auf, nachdem die Komponente erstellt wurde
        this.init();
    }

    otpInputHandler(event) {
        this.setState({ otp: event.target.value });
    }

    ansichtAccountAnlegen() {
        //Wechselt in die Ansicht zur Neuanlage eines Accounts
        this.setState({ step: 1 });
    }



    accountAnlegenHandler() {
        //OTP im State zwischenspeichern, später zusammen mit Adresse einen Request ausführen (Create OTP-Route)
        console.log(this.state.otp);
        this.setState({ step: 2 })
        }
    

    walletVerifizieren() {
        //Überprüft, ob der Nutzer tatsächlich ein funktionierendes Wallet verbunden hat
        //TODO: Wallet verifizieren
        this.setState({ step: 3 });
    }

    signaturÜberprüfen() {
        //Überprüft, ob das angegebene Wallet auch wirklich dem Nutzer gehört, indem ein Random-Wert von diesem signiert werden soll
        //TODO: Signaturprozess
        this.setState({ step: 4 });
    }

    displayError() {
        alert("Ups, das hat leider nicht funktioniert")
    }

    init() {
        /**
     * Initializes Ethereum Wallet Provider and Web3 Instance
     * In case the browser is a desktop browser without wallet capability,
     * the Standard WalletLink is used to create a Wallet Provider instance.
     * WalletLink is supported by Coinbase as an example: https://github.com/walletlink/walletlink
     */
        const APP_NAME = 'DHBW Bachelors Night Ticketing - 2020'
        const APP_LOGO_URL = 'https://einfachtierisch.de/media/cache/article_teaser/cms/2015/09/Katze-lacht-in-die-Kamera-shutterstock-Foonia-76562038.jpg?595617'
        const ETH_JSONRPC_URL = 'https://mainnet.infura.io/v3/efaece4f5f4443979063839c124c8171' // Mainnet
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

    async walletLogin() {
        //Wechselt in die Ansicht zur Anmeldung mit einem bestehenden Wallet
        const response = await fetch("http://localhost:3000/auth/login", {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ address: window.ethereum.selectedAddress }) //body, data type must match "Content-Type" header
        }).catch(console.log);

        if (!response) {
            alert("Fehler");
            return;
        }

        const data = await response.json().catch(console.log);

        console.log(data);

        this.setState({ step: 5 });

        this.sign(data.challenge);
    }

    async connectWallet() {
        // Requesting connection to wallet
        var accounts = await window.ethereum.enable().catch(this.displayError);
        if (!accounts) return;

        console.log(`User's address is ${accounts[0]}`);
        this.web3.eth.defaultAccount = accounts[0];
        this.setState({ connected: true });
        this.setState({ step: 3 })

    }

    async createUser(){
        const response = await fetch('http://localhost:3000/auth/otpcreate/' + this.state.otp, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ address: window.ethereum.selectedAddress }) //body, data type must match "Content-Type" header
        }).catch(console.log);

        if (!response) {
            alert("Fehler");
            return;
        }

        const test = await response.json().catch(console.log);

        console.log(test);

    }

    async verifyAddress(){
        if (!window.ethereum) return this.displayError();
        if (!window.ethereum.selectedAddress) return this.displayError();
        var from = window.ethereum.selectedAddress;

        var text = 'Test12345';
        var msg = this.web3.utils.stringToHex(text);

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
            } else {
                alert('Failed to verify signer when comparing ' + recovered + ' to ' + from)
            }
        })

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

            console.log(result);

            //mit dem Result weiterrechnen  

            const response = await fetch('http://localhost:3000/auth/chr/' + challengeString, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address: from, signature: result.result })
            }).catch(console.log);

            if (!response) {
                alert("Fehler");
                return;
            }

            console.log(response)
    });
}





linkToCreateCoinbaseWallet() {
    window.open('https://wallet.coinbase.com/#signup', '_blank');
}

render() {
    return (

        <Box className="AccountManagement" pad="medium" gap="small">

            {this.state.step === 0 &&
                <Box gap="small">
                    Klicke hier, um einen neuen Account anzulegen
                    <Button label="Account anlegen" onClick={this.ansichtAccountAnlegen} gap="small"></Button>
                    Klicke hier, um dich mit deinem Wallet einzuloggen
                    <Button label="Mit vorhandenem Wallet einloggen" onClick={this.walletLogin}></Button>
                </Box>
            }

            {this.state.step === 1 &&
                <Box gap="small">
                    Hier wollen wir das OTP abfragen
                    <TextInput
                        placeholder="type here"
                        value={this.state.otp}
                        onChange={this.otpInputHandler}
                    />
                    <Button label="Account anlegen" onClick={this.accountAnlegenHandler}></Button>
                </Box>
            }
            {this.state.step === 2 &&
                <Box className="WalletSetup" direction="column" gap="small">
                    <h1>Wallet Setup</h1>
                    <Text>
                        Um Tickets zu erwerben benötigen Sie ein sogenanntes Wallet.
                        Dieses ist vergleichbar mit Ihrer Geldbörse zu der nur Sie Zugriff haben.
                        </Text>
                    {(!this.state.walletAvailable && !this.state.connected) &&
                        <Box gap="small">
                            <Button label="Wallet auf dem Smartphone erstellen" onClick={this.linkToCreateCoinbaseWallet}></Button>
                        </Box>
                    }

                    {!this.state.connected &&
                        <Box gap="small">
                            <Text>
                                Als Nächstes benötigt unsere Plattform die Adresse Ihres Wallets.
                                Bitte bestätigen Sie daher die Verbindung mit Ihrem Wallet über folgende Schaltfläche.
                                    Sie geben dadurch <b>nicht</b> Ihre Kontrolle über das Wallet ab!
                                </Text>
                            <Text>
                                Nach einem Klick auf den Button muss mit Coinbase Wallet der angezeigte QR-Code eingescannt werden, um das Wallet zu überprüfen.
                                </Text>
                            <Button label="Mit vorhandenem Wallet verbinden" onClick={this.connectWallet}></Button>
                        </Box>
                    }
                    {(this.state.walletAvailable) &&
                        //TODO: Wenn Wallet verfügbar und connected, soll nicht das Walletsetup angezeigt werden.
                        this.setState({ step: 5 })
                    }
                </Box>
            }

            {this.state.step === 3 &&
                <Box gap="small">
                    <Text>
                        Das Wallet ist erfolgreich verbunden!
                        Hier folgt eine Demonstration zur Signatur
                            </Text>

                    <Button label="Signaturprozess anstoßen" onClick={this.verifyAddress}></Button>
                </Box>
            }
            {this.state.step === 4 &&
                <Box gap="small">
                    Überprüfe mittels Signatur, ob das Wallet auch dem Nutzer gehört
                        <Button label="Zur Walletanmeldung" onClick={this.walletLogin}></Button>
                </Box>
            }
            {this.state.step === 5 &&
                <Box gap="small">
                    Bitte klicken Sie auf den Button, um sich einzuloggen.
                    Hier noc begrßnden warum signieren----....
                    <Button label="Signaturprozess anstoßen" onClick={this.sign}></Button>
                </Box>
            }
        </Box>
    );
}
}

export default AccountManagement;
