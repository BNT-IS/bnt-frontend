import React from 'react';
import { Box, Button, Text } from 'grommet';
import Web3 from 'web3';
import WalletLink from 'walletlink';

class WalletSetup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.sign = this.sign.bind(this);
        this.connectWallet = this.connectWallet.bind(this);
    }

    /**
     * Calling the initialization directly after this component
     * was created and mounted in the DOM.
     */
    componentDidMount() {
        this.init();
    }

    displayError() {
        alert("Ups, das hat nicht geklappt");
    }

    /**
     * Initializes Ethereum Wallet Provider and Web3 Instance
     * In case the browser is a desktop browser without wallet capability,
     * the Standard WalletLink is used to create a Wallet Provider instance.
     * WalletLink is supported by Coinbase as an example: https://github.com/walletlink/walletlink
     */
    init() {
        // TODO: Move these constants to a global constants file
        const APP_NAME = 'DHBW Bachelors Night Ticketing 2020'
        const APP_LOGO_URL = 'https://einfachtierisch.de/media/cache/article_teaser/cms/2015/09/Katze-lacht-in-die-Kamera-shutterstock-Foonia-76562038.jpg?595617'
        const ETH_JSONRPC_URL = 'https://mainnet.infura.io/v3/efaece4f5f4443979063839c124c8171' // Mainnet
        const CHAIN_ID = 1

        this.setState({ walletAvailable: window.ethereum ? true : false });

        if (!window.ethereum) {

            // Initialize WalletLink
            this.walletLink = new WalletLink({
                appName: APP_NAME,
                appLogoUrl: APP_LOGO_URL,
                darkMode: false
            })

            // Initialize a Web3 Provider object
            window.ethereum = this.walletLink.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID);
        }

        // Checking if wallet is already connected or not
        // eslint-disable-next-line
        this.setState({ connected: window.ethereum.selectedAddress ? true : false });

        // Creating Web3 Instance
        this.web3 = new Web3(window.ethereum);
    }

    /**
     * Attempts to connect with the Wallet
     */
    async connectWallet() {
        // Requesting connection to wallet
        var accounts = await window.ethereum.enable().catch(this.displayError);
        if (!accounts) return;

        console.log(`User's address is ${accounts[0]}`);
        this.web3.eth.defaultAccount = accounts[0];
        this.setState({ connected: true });
    }

    /**
     * Example method for showing how a message can be signed and verified.
     */
    async sign() {
        if (!window.ethereum) return this.displayError();
        if (!window.ethereum.selectedAddress) return this.displayError();
        var from = window.ethereum.selectedAddress;

        var text = 'Hallo du Frosch!';
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

    /**
     * Just a method to open a new tab...
     */
    linkToDownloadMetaMask() {
        window.open('https://wallet.coinbase.com/', '_blank');
    }

    render() {
        return (
            <Box className="WalletSetup" direction="column" gap="medium" pad="medium">
                <h1>Wallet Setup</h1>
                <Text>
                    Um Tickets zu erwerben benötigen Sie ein sogenanntes Wallet.
                    Dieses ist vergleichbar mit Ihrer Geldbörse zu der nur Sie Zugriff haben.
                </Text>
                {(!this.state.walletAvailable && !this.state.connected) &&
                    <Box gap="medium">
                        <Text>
                            Für unser Ticket-System muss dieses Wallet Ethereum-fähig sein.
                            Wir empfehlen Ihnen daher das Coinbase Wallet.
                            Bitte installieren Sie sich das Coinbase Wallet über die offizielle Website.
                            Kommen Sie nach Abschluss der Einrichtung wieder auf diese Seite zurück.
                        </Text>
                        <Button label="Coinbase für's Smartphone installieren" onClick={this.linkToDownloadMetaMask}></Button>
                    </Box>
                }
                {!this.state.connected &&
                    <Box gap="medium">
                        <Text>
                            Als Nächstes benötigt unsere Plattform die Adresse Ihres Wallets.
                            Bitte bestätigen Sie daher die Verbindung mit Ihrem Wallet über folgende Schaltfläche.
                            Sie geben dadurch <b>nicht</b> Ihre Kontrolle über das Wallet ab!
                        </Text>
                        <Button label="Mit dem Wallet verbinden" onClick={this.connectWallet}></Button>
                    </Box>
                }
                <Text>
                    Hier folgt eine DEMO!!!
                </Text>
                <Button label="Sign and Verify Message" onClick={this.sign}></Button>
            </Box>
        );
    }
}

export default WalletSetup;
