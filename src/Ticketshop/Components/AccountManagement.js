import React from 'react';
import { Box, Button, TextInput, Text } from 'grommet';

class AccountManagement extends React.Component {

    constructor(props) {
        super(props);
        this.otpInputHandler = this.otpInputHandler.bind(this);
        this.accountAnlegenHandler = this.accountAnlegenHandler.bind(this);
        this.state = { otp: "", step: 0 };
    }

    otpInputHandler(event) {
        this.setState({ otp: event.target.value });
    }

    accountAnlegenHandler() {
        // TODO: Passwort überprüfen...
        this.setState({ step: 1 });
    }

    render() {
        return (
            <Box className="AccountManagement" pad="medium" gap="small">
                {this.state.step === 0 &&
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
                {this.state.step === 1 &&
                    <Box>
                        Hier muss Hinweis erfolgen zum Wallet erstellen und verknüpfen
                        <Text>
                            Um Tickets zu erwerben benötigen Sie ein sogenanntes Wallet.
                            Dieses ist vergleichbar mit Ihrer Geldbörse zu der nur Sie Zugriff haben.
                        </Text>
                    </Box>
                }
            </Box>
        );
    }
}

export default AccountManagement;
