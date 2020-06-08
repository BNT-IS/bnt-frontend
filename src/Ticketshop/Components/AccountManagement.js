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
        this.signaturÜberprüfen = this.signaturÜberprüfen.bind(this);
        this.walletLogin = this.walletLogin.bind(this);
        this.walletVerifizieren = this.walletVerifizieren.bind(this);
        this.state = { otp: "", step: 0 };
        this.sampleArray = ["12345", "67891", "23456", "78912", "34567", "89123", "45678", "91234", "56789"];
        
    }
    

    otpInputHandler(event) {
        this.setState({ otp: event.target.value });
    }

    ansichtAccountAnlegen(){
        //Wechselt in die Ansicht zur Neuanlage eines Accounts
        this.setState({ step: 1 });
    }

    accountAnlegenHandler() {
        for(var i=0; i<this.sampleArray.length; i++){
            var j = false; 
            console.log(this.state.otp, this.sampleArray[i])
            if(this.state.otp === this.sampleArray[i]){
                this.setState({ step: 2 });
                j = true;
                break;
            }
            if (j === false){
                alert("Das eingegebene Passwort ist ungültig. Das richtige Passwort wäre " + this.state.otp);
                this.setState({ step: 0 });
                break;
            }              
        }      
    }

    walletVerifizieren(){
        //Überprüft, ob der Nutzer tatsächlich ein funktionierendes Wallet verbunden hat
        //TODO: Wallet verifizieren
        this.setState({ step: 3 });
    }

    signaturÜberprüfen(){
        //Überprüft, ob das angegebene Wallet auch wirklich dem Nutzer gehört, indem ein Random-Wert von diesem signiert werden soll
        //TODO: Signaturprozess
        this.setState({ step: 4 });
    }

    walletLogin(){
        //Wechselt in die Ansicht zur Anmeldung mit einem bestehenden Wallet
        this.setState({ step: 5 });
    }

    render() {
        return (

            <Box className="AccountManagement" pad="medium" gap="small">

                {this.state.step === 0 &&
                <Box gap="small">
                    Klicke hier, um einen neuen Account anzulegen
                    <Button label ="Account anlegen" onClick ={this.ansichtAccountAnlegen} gap="small"></Button>
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
                    <Box gap="small">
                        Hier muss Hinweis erfolgen zum Wallet erstellen und verknüpfen
                        <Text>
                            Um Tickets zu erwerben benötigen Sie ein sogenanntes Wallet.
                            Dieses ist vergleichbar mit Ihrer Geldbörse zu der nur Sie Zugriff haben.
                        </Text>
                        <Button label="Ich habe das Wallet erstellt" onClick={this.walletVerifizieren}></Button>
                    </Box>
                }
                {this.state.step === 3 &&
                    <Box gap="small">
                        Überprüfe, ob das angegebene Wallet auch existiert bzw. verbunden ist
                        <Button label ="Prüfe Wallet" onClick={this.signaturÜberprüfen}></Button>
                    </Box>
                }
                {this.state.step === 4 &&
                    <Box gap="small">
                        Überprüfe mittels Signatur, ob das Wallet auch dem Nutzer gehört
                        <Button label ="Zur Walletanmeldung" onClick={this.walletLogin}></Button>
                    </Box>
                }
                {this.state.step === 5 &&
                    <Box gap="small">
                        Bitte melden Sie sich mit Ihrem Wallet an.
                    </Box>
                }
            </Box>
        );
    }
}

export default AccountManagement;
