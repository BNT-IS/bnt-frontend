import { CSVReader } from 'react-papaparse';
import React from 'react';
import { Box, Button, Select, Text, List, TextInput } from 'grommet';
import Config from '../../config';

// TODO: Diese Funktion sollte vielleicht eher ins Shop-Management
class ShopManagamentAbsolventenListe extends React.Component {

    constructor(props) {
        super(props);
        this.state = { listeEingelesen: false, initialeListe: [] };
        this.transferListForCreation = this.transferListForCreation.bind(this);
        this.switchBackToShopmanagament = this.switchBackToShopmanagament.bind(this)
    }

    //Eingelesene Daten entgegennehmen und in den State schreiben
    handleOnDrop = (data) => {
        var liste = [];
        data.forEach((data) => {
            liste.push(data.data)
        });

        this.setState({ listeEingelesen: true, initialeListe: liste })
    }

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }

    handleOnRemoveFile = (data) => {

    }

    transferListForCreation() {
        this.props.useListAndSendMail(this.state.initialeListe)
        window.location.assign("#/eventmgmt/shop")
    }

    switchBackToShopmanagament() {
        window.location.assign("#/eventmgmt/shop")
    }

    render() {
        var Ansicht = [];
        var emailList = this.state.initialeListe;
        Ansicht =
            <Box style style={{ position: 'absolute', left: '40%', top: '10%' }}>
                <Box pad="medium">
                    <Text size="large" weight="bold">Einlesen der Absolventen Liste</Text>
                </Box>

                <Box className="Eingaben">
                    <Box pad="medium">
                        <Text>Bitte eine Liste in der folgenden Darstellung einlesen:</Text>
                        <span><Text weight="bold">Header: </Text><Text>E-Mail; Name</Text></span>
                        <span><Text weight="bold">Datensatz 1: </Text><Text>Beispiel@web.de; Mustermann, Max</Text></span>
                    </Box>
                    <CSVReader
                        onDrop={this.handleOnDrop}
                        onError={this.handleOnError}
                        config={{
                            delimiter: ";",
                            header: true
                        }}
                        addRemoveButton
                        onRemoveFile={this.handleOnRemoveFile}
                    >
                        <span>Drop CSV file here or click to upload.</span>
                    </CSVReader>
                </Box>

                {this.state.listeEingelesen &&
                    <List className="langeListe" pad="medium"
                        primaryKey="E-Mail"
                        secondaryKey="Name"
                        data={emailList}
                    />
                }
                <Box pad="medium">
                    {this.state.listeEingelesen && <Button onClick={this.transferListForCreation} label="Passwörter erstellen"></Button>}
                </Box>

                <Box pad="medium">
                    <Button onClick={this.switchBackToShopmanagament} label="Zurück" ></Button>
                </Box>

            </Box>
        return Ansicht;
    }
}
export default ShopManagamentAbsolventenListe;