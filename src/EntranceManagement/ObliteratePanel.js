import React from 'react';
import { Box, Button } from 'grommet';

class ObliteratePanel extends React.Component {

    constructor(props) {
        super(props);
        this.obliterate = this.obliterate.bind(this);
        this.state = { obliterating: false };
    }

    obliterate() {
        const st = this.state;
        st.obliterating = true;
        this.setState(st);
        this.props.onStartObliterate(2).then((success) => {
            //st.obliterating = false;
            //this.setState(st);
            alert(success);
            // Show something different.
        }).catch((error) => {
            alert(error);
            st.obliterating = false;
            this.setState(st);
        });
    }

    render() {
        const poolTickets = parseInt(this.props.account.poolTickets);
        const paidTickets = parseInt(this.props.account.paidTickets);
        const parkTickets = parseInt(this.props.account.parkTickets);
        const sum = poolTickets + paidTickets + parkTickets;
        const balance = parseInt(this.props.account.balance);

        return (
            <Box className="ObliteratePanel" direction="column" gap="medium" pad="medium">
                <span>Wallet Address: {this.props.account.address}</span>
                <span>Balance: {this.props.account.balance}</span>
                {!this.state.obliterating &&
                    <Box gap="small">
                        {balance === sum + 1 &&
                            <Button label="Studenten-Ticket Einlösen" onClick={this.obliterate}></Button>
                        }
                        {balance <= sum + 1 &&
                            <Button label="Besucher-Ticket Einlösen" onClick={this.obliterate}></Button>
                        }
                    </Box>
                }
                {this.state.obliterating &&
                    <span>Obliterating Tickets...</span>
                }
            </Box>
        );
    }
}

export default ObliteratePanel;
