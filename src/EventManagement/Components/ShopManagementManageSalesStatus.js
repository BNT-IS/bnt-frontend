import React from 'react';
import { Box, Button, Text, Select } from 'grommet';
import './ShopManagement.css';
import './ShopManagement.js';
import UserContext from '../../AppContexts/UserContext';

class ShopManagementManageSalesStatus extends React.Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            salesStatus: "Aktivieren"
        }
        this.setValuesAndChangeStep = this.setValuesAndChangeStep.bind(this);
        this.switchSalesStatus = this.switchSalesStatus.bind(this)
        this.changeToShopMangement = this.changeToShopMangement.bind(this)
    }

    switchSalesStatus() {
        if (this.props.salesStatus) {
            return <Text weight="bold">Aktiv</Text>
        }
        if (!this.props.salesStatus) {
            return <Text weight="bold">Nicht Aktiv</Text>
        }
    }

    //Change Values of State into Boolean, compare new Sales Status with props. If Sales Status has changed Execute props Function to Change. 
    setValuesAndChangeStep() {
        var salesStatusBoolean = ""
        if (this.state.salesStatus === "Aktivieren") {
            salesStatusBoolean = true;
        }
        if (this.state.salesStatus === "Deaktivieren") {
            salesStatusBoolean = false;
        }


        if (salesStatusBoolean === this.props.salesStatus) {
            console.log("Der Sales Status wurde wurde nicht verändert! Es wird keine Nachricht an das Backend gesendet")
            window.location.assign("#/eventmgmt/shop");
            return;
        }
        if (salesStatusBoolean !== this.props.salesStatus) {
            this.props.setConfSalesStatus(salesStatusBoolean);
            window.location.assign("#/eventmgmt/shop");
        }
    }

    changeToShopMangement() {
        window.location.assign("#/eventmgmt/shop");
    }

    render() {
        var Ansicht = [];
        return (
            Ansicht[0] =
            <Box pad="medium" align="center" style={{ position: 'absolute', left: '40%', top: '10%' }}>
                <Box className="outerBoxOverview" direction="column" align="center">
                    <Text weight="bold" size="xxlarge">Status des Verkaufs ändern</Text>
                    <Box pad="medium">
                        <Text>Der Verkauf ist derzeit: {this.switchSalesStatus()}</Text>
                    </Box>
                    <Box>
                        <Select
                            options={['Aktivieren', 'Deaktivieren']}
                            value={this.state.salesStatus}
                            onChange={({ option }) => { this.setState({ salesStatus: option }) }}
                        />

                    </Box>
                    <Box direction="row" pad="medium">
                    <Button label="Zurück" onClick={this.changeToShopMangement}></Button>
                    <Button label="Bestätigen" onClick={this.setValuesAndChangeStep}></Button>
                    </Box>
                </Box >
            </Box>
        );
    }
}
export default ShopManagementManageSalesStatus;
