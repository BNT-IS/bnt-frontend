import React from 'react';
import { Box, Button, Text, List, TextInput } from 'grommet';
import Config from '../../config';
import './ShopManagement.css';
import './ShopManagement.js';
import UserContext from '../../AppContexts/UserContext'


class ShopManagementViewOTPs extends React.Component {

    static contextType = UserContext;


    constructor(props) {
        super(props);
        this.state = {
            OTPs: [],
            searchOTP: "",
            headline1: [{
                id: "ID des One Time Passworts", email: "E-Mail-Adresse des Benutzers",
                targetRole: "Rolle für den Benutzer", createdAt: "Erstellungsdatum", cancel: "OTP löschen"
            }],
        };
        this.getOTPs = this.getOTPs.bind(this);
        this.changeStep = this.changeStep.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.searchOTPHandler = this.searchOTPHandler.bind(this);
        this.deleteOtp = this.deleteOtp.bind(this);
    }

    componentDidMount() {
        this.getOTPs();
    }

    //Get all OTPs from Database
    async getOTPs() {
        const response = await fetch(Config.BACKEND_BASE_URI + '/api/v2/oneTimePasses/', {
            method: 'GET',
            mose: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
        }).catch(console.log);

        if (!response.ok) {
            console.log(response.message)
            return;
        } else {

            //Change Value from Roles to String
            var otps = await response.json().catch(console.log);
            var otpsRole = []
            otps.forEach(otp => {
                if(otp.targetRole === 1){ 
                    otp.targetRole = "Absolvent";
                }
                else if(otp.targetRole === 0){
                    otp.targetRole = "Administrator"
                }else{
                    otp.targetRole = "Undefined"
                }
                otpsRole.push(otp)
                
            });
            this.setState({ OTPs: otpsRole })
        }
    }
    //Delete OTP from Database
    async deleteOtp(optId) {
        const response = await fetch(Config.BACKEND_BASE_URI + '/api/v2/oneTimePasses/' + optId, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token,
            },
        }).catch(console.log);

        if (!response.ok) {
            alert("Die Lösung des One Time Passworts ist Fehlgeschlagen");
            return
        } else {
            alert("Das One Time Passwort mit der: " + optId + " wurde gelöscht.");
            this.componentDidMount();
        }
    }

    //Switch View to ShopManagement
    changeStep() {
        window.location.assign('#/eventmgmt/shop');
    }

    //Get ChangeEvent from Select and Set to component state
    searchOTPHandler(event) {
        this.setState({ searchOTP: event.target.value });
    }

    render() {
        var ansicht = [];
        let otps;
        var mail = this.state.searchOTP;
        if (mail !== "") {
            otps = this.state.OTPs.filter((otp) => { return otp.email.toLowerCase().includes(mail.toLowerCase()) });
        } else {
            otps = this.state.OTPs;
        }

        return (
            ansicht[0] =
            <Box className="outerBoxOverview" direction="column" align="center">
                <Text weight="bold" size="xlarge">One Time Passwort Übersicht</Text>
                <Box pad="medium"></Box>
                    <Text>Hier können die One Time Passwörter angezeigt und gelöscht werden.</Text>
                <Box pad="medium"></Box>
                    <Button label="Zurück zur Übersichtsseite" onClick={this.changeStep} pad="small"></Button>
                    <Box pad="medium"></Box>
                        <Box pad="small">
                            <List
                                pad="medium"
                                alignSelf="stretch"
                                margin="small"
                                primaryKey={(headline1) => { return <b key={headline1.id + 't'}> {headline1.id || 'Unknown'} </b> }}
                                secondaryKey={(headline1) => {
                                    return <span key={headline1.id + 's'}> {"|   " + headline1.email + "   |" || 'Unknown'}
                                        {headline1.createdAt + "   |" || 'Unknown'} {headline1.cancel + "   |" || 'Unknown'} </span>
                                }}
                                data={this.state.headline1}
                            />
                            <TextInput gap="small" placeholder="Zum Suchen in den offenen Buchungen bitte eine E-Mail-Adresse eingeben" value={this.state.searchOTP} onChange={this.searchOTPHandler}></TextInput>
                            <List
                                pad="medium"
                                alignSelf="stretch"
                                margin="small"
                                primaryKey={(otp) => { return <b key={otp.id + 't'}> {otp.id || 'Unknown'} </b> }}
                                secondaryKey={(otp) => { return <span key={otp.id + 's'}> {"|  " + otp.email + "    |" || 'Unknown'} {otp.targetRole + "    |" || 'Unknown'}   {(new Date(otp.createdAt).toLocaleDateString()) || 'Unknown'} | <Button label="OTP löschen" onClick={() => { this.deleteOtp(otp.id) }}></Button></span> }}
                                data={otps}
                            />
                        </Box>
            </Box>
        );
    }
}
export default ShopManagementViewOTPs;