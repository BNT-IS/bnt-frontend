import React from 'react';
import { Box, Button, Text, TextInput, Select } from 'grommet';
import './ShopManagement.css';
import './ShopManagement.js';

class ShopManagementManageOTPS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            OTP: "",
            role: 1,
            lastEmail: "",
            lastRole: ""
        }

        this.changeToShopMangement = this.changeToShopMangement.bind(this)
        this.addOTP = this.addOTP.bind(this);
    }

    changeToShopMangement() {
        window.location.assign("#/eventmgmt/shop");
    }

    async addOTP() {
        var role;
        if (this.state.role === "Administrator") {
            role = 0;
        }
        if (this.state.role === "Absolvent") {
            role = 1;
        }
        var response = await this.props.createOTPwithEmailAndRole(this.state.OTP, role)
        if (response === 1) {
            this.setState({ lastEmail: this.state.OTP, lastRole: this.state.role })
        }
    }

    render() {
        var Ansicht = [];
        return (
            Ansicht[0] =
            <Box className="outerBoxOverview" direction="column" align="center" style={{ position: 'absolute', left: '40%', top: '10%' }}>
                <Text weight="bold" size="xxlarge">Verwaltung der One Time Passwörter</Text>
                <Box pad="medium" direction="column">
                    <Text>Letzter hinzugefügter Datensatz</Text>
                    <Text weight="bold">E-Mail-Adresse: {this.state.lastEmail} </Text>
                    <Text weight="bold">Rolle: {this.state.lastRole} </Text>


                </Box>
                <Box pad="medium" direction="row">
                    <TextInput
                        placeholder="Hier E-Mail-Adresse eingeben"
                        value={this.state.OTP}
                        onChange={(event) => { this.setState({ OTP: event.target.value }) }}
                    />
                    <Select
                        placeholder="Rolle auswählen"
                        options={['Administrator', 'Absolvent']}
                        value={this.state.role}
                        onChange={({ option }) => { this.setState({ role: option }) }}
                    />
                </Box>
                <Box pad="medium" direction="row">
                    <Button label="Zurück" onClick={this.changeToShopMangement}></Button>
                    <Button label="Hinzufügen" onClick={this.addOTP}></Button>
                </Box>
            </Box >
        );
    }
}
export default ShopManagementManageOTPS;
