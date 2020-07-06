import React from 'react';
import { Box, Button, TextInput, Text, Header } from 'grommet';
import Config from '../config';
import UserContext from '../AppContexts/UserContext';

class Login extends React.Component {

    static contextType = UserContext;

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
        this.state = { dhbw_mail: "", login_pass: "", new_pass: "", otp: "", pass1: "", pass2: "", step: 0, access_token: "" };
        this.tokenHandler = this.tokenHandler.bind(this);
        this.verifyPasswort = this.verifyPasswort.bind(this);
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

    verifyPasswort() {
        if (this.state.pass1 === this.state.pass2) {
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

        if (!response.ok) {
            alert("Für das eingegebene OTP konnte kein User angelegt werden.");
            const rückgabe = await response.json().catch(console.log);
            if (rückgabe.message) {
                alert(rückgabe.message + " Ihr angegebenes OTP scheint nicht zu exisitieren. Bitte überprüfen Sie die Eingabe.");
                this.setState({ step: 1 });
            }
            return;
        } else {
            const rückgabe = await response.json().catch(console.log);
            if (rückgabe) {
                alert("Der Nutzer wurde erfolgreich angelegt.");
                this.handleFinalLogin(rückgabe);
            }
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
            body: JSON.stringify({ email: this.state.dhbw_mail, password: this.state.login_pass })
        }).catch(console.log);

        if (!response.ok) {
            const rückgabe = await response.json().catch(console.log);
            switch (response.status) {
                case 401:
                    alert("Ihre Anmeldedaten scheinen nicht zu stimmen. Bitte überprüfen Sie ihre Angaben.");
                    break;
                case 500:
                    alert("Die Anmeldung ist aufgrund eines Server-Fehlers fehlgeschlagen. Bitte versuchen Sie es später erneut.");
                    break;
                default:
                    alert(rückgabe.message);
            }
            this.setState({ step: 6 });
            return;
        } else {
            const rückgabe = await response.json().catch(console.log);
            if (rückgabe) {
                this.handleFinalLogin(rückgabe);
            }
        }
    }

    handleFinalLogin(userData) {
        this.context.setUserContext(userData);
        this.context.redirectUserToHome();
    }

    setState1() {
        //Springt zur Eingabe des OTP's im Erstellungsprozess
        this.setState({ step: 1 });
    }

    setState6() {
        //Springt zur Anmeldung mit einem vorhandenen Wallet
        this.setState({ step: 6 });
    }

    render() {
        //Stellt die jeweiligen Schritte für den Benutzer dar
        return (

            <Box className="AccountManagement" gap="small">
                <Header background="brand" justify="between" pad="10px">
                    <Text>BNT Ticketsystem</Text>
                </Header>
                <Box pad="small">
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
                    {this.state.step === 6 &&
                        <Box gap="small">
                            <h1>Anmeldung mit einem vorhandenen Account</h1>
                            <TextInput placeholder="DHBW-Mailadresse eingeben" value={this.state.dhbw_mail} onChange={this.mailHandler}></TextInput>
                            <TextInput placeholder="Account-Passwort eingeben" value={this.state.login_pass} onChange={this.loginPassHandler}></TextInput>
                            <Button label="Anmelden" onClick={this.login}></Button>
                        </Box>
                    }
                </Box>
            </Box>
        );
    }
}
export default Login;


