import React from 'react';
import { Box, Button, TextInput, Text } from 'grommet';
import Web3 from 'web3';
import Config from '../config';


class AccountManagement extends React.Component {

    constructor(props) {
        super(props);
        this.createUser = this.createUser.bind(this);
        this.login = this.login.bind(this);
        this.loginPassHandler = this.loginPassHandler.bind(this);
        this.mailHandler = this.mailHandler.bind(this);
        this.otpBestätigen = this.otpBestätigen.bind(this);
        this.otpInputHandler = this.otpInputHandler.bind(this);
        this.pass1Handler = this.pass1Handler.bind(this);
        this.pass2Handler = this.pass2Handler.bind(this);
        this.setState1 = this.setState1.bind(this);
        this.setState6 = this.setState6.bind(this);
        this.state = { dhbw_mail: "", login_pass: "", new_pass: "", otp: "", pass1: "", pass2: "", step: 0, access_token: ""};
        this.tokenHandler = this.tokenHandler.bind(this);
        this.verifyPasswort = this.verifyPasswort.bind(this);
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

    pass1Handler(event) {
        this.setState({ pass1: event.target.value });
    }

    pass2Handler(event) {
        this.setState({ pass2: event.target.value });
    }

    mailHandler(event) {
        this.setState({ dhbw_mail: event.target.value });
    }

    loginPassHandler(event) {
        this.setState({ login_pass: event.target.value });
    }

    verifyPasswort(){
        if(this.state.pass1 === this.state.pass2){
            alert("Die angegebenen Passwörter stimmen überein!");
            this.createUser(this.state.pass2);
        }
        else {
            alert("Die angegebenen Passwörter stimmen nicht überein!");
            this.setState({ pass1: "" });
            this.setState({ pass2: "" });
        }
    }

    displayError() {
        //Wirft eine Standardfehlermeldung aus
        alert("Ups, das hat leider nicht funktioniert. Bitte versuchen Sie es erneut.")
    }

    async createUser(pw) {
        //Legt anhand des eingegebenen OTP's einen User mit dem gewählten Passwort an
        const response = await fetch(Config.BACKEND_BASE_URI + '/auth/createUser/' + this.state.otp, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword: pw })
        }).catch(console.log);

        if (!response) {
            alert("Für das eingegebene OTP konnte kein User angelegt werden.");
            return;
        }

        const test = await response.json().catch(console.log);
        if(test.message !== "Passwort nicht existent."){
        alert("Der Nutzer wurde erfolgreich angelegt.");
        this.setState ({ step: 3 });
        }
        else {
            alert(test.message + " Ihr angegebenes OTP scheint nicht zu exisitieren. Bitte überprüfen Sie die Eingabe.");
            this.setState ({ step: 1 });
        }
    }

    async login() {
        const response = await fetch(Config.BACKEND_BASE_URI + '/auth/login', {
            method: 'POST',
            mose: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: this.state.dhbw_mail, password: this.state.login_pass})
        }).catch(console.log);

        const userValue = await response.json().catch(console.log);
        console.log(userValue);
        if(userValue.message !== "Falsche E-Mailadresse oder falsches Passwort."){
        this.setToken('access_token', userValue.token);
        this.setToken('user_id', userValue.user.id);
        this.setToken('user_email', userValue.user.email);
        this.setToken('user_role', userValue.user.role);
        this.setState({ step: 3 });
        }
        else {
            alert(userValue.message);
        }
    }

    setToken(token_name, access_token) {
        //Schreibt einen Token in den LocalStorage des Browsers
        localStorage.setItem(token_name, access_token);
    }

    getToken() {
        //Liest einen Token aus dem LocalStorage des Browsers aus
        return localStorage.getItem('access_token');
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
                        <Text>Bitte geben Sie das OneTime-Passwort ein, das wir an Ihre DHBW-Mailadresse versendet haben, und bestätigen Sie die Eingabe</Text>
                        <TextInput placeholder="OTP eingeben" value={this.state.otp} onChange={this.otpInputHandler}></TextInput>
                        <Button label="Eingabe bestätigen" onClick={this.otpBestätigen}></Button>
                    </Box>
                }
                {this.state.step === 2 &&
                    <Box classname="Passwortvergabe" direction="column" gap="small">
                        <h1>Passwortvergabe</h1>
                        <Text>Bitte vergeben Sie ein neues Passwort für Ihren Account</Text>
                        <TextInput placeholder="Neues Passwort vergeben" value={this.state.pass1} onChange={this.pass1Handler}></TextInput>
                        <TextInput placeholder="Neues Passwort bestätigen" value={this.state.pass2} onChange={this.pass2Handler}></TextInput>
                        <Button label="Passwort bestätigen" onClick={this.verifyPasswort}></Button>
                    </Box>
                }
                {this.state.step === 3 &&
                
                    <Box gap="small">
                        <Text>Sie haben sich erfolgreich angemeldet.</Text>
                        <Button label="Test123" ></Button>
                    </Box>
                }
                {this.state.step === 4 &&
                    <Box gap="small">
                    </Box>
                }
                {this.state.step === 5 &&
                    <Box gap="small">
                    </Box>
                }
                {this.state.step === 6 &&
                    <Box gap="small">
                        <h1>Anmeldung mit einem vorhandenen Account</h1>
                        <TextInput placeholder="DHBW-Mailadresse eingeben" value={this.state.dhbw_mail} onChange={this.mailHandler}></TextInput>
                        <TextInput placeholder="Account-Passwort eingeben" value={this.state.login_pass} onChange={this.loginPassHandler}></TextInput>
                        <Button label="Anmelden" onClick={this.login}></Button>
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