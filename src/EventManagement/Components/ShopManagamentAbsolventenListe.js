import { CSVReader } from 'react-papaparse';
import React from 'react';
import { Box, Button, Text, List} from 'grommet';

class ShopManagamentAbsolventenListe extends React.Component {

    constructor(props) {
        super(props);
        this.state = { listeEingelesen: false, initialeListe: [] };
        this.transferListForCreation = this.transferListForCreation.bind(this);
        this.switchBackToShopmanagament = this.switchBackToShopmanagament.bind(this)
    }

    //Clean Data from CSV-Reader and Save cleaned List into Componentstate 
    handleOnDrop = (eingleseneListe) => {
        var liste = [];
        var gefilterteListe = eingleseneListe.filter(data => data.data.eMail.match("@"))
        gefilterteListe.forEach((element) => {
            var newElement = {eMail: element.data.eMail, Name: element.data.Name};
            liste.push(newElement);
        }
        )
        this.setState({ listeEingelesen: true, initialeListe: liste })
    }

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }

    handleOnRemoveFile = (data) => {

    }

    //Send Request from ShopManagement for each E-Mail-Address in List
    async transferListForCreation() {
        var emailList = this.state.initialeListe;
        var counter = 0
        for (const element of emailList) {
            var response = await this.props.createOTPwithEmailAndRole(element.eMail, 1);
            console.log(response);
            if (response === 1){
                counter = counter + response   
            }
            if(response !== 1){
                console.log("Fehler beim Senden der One Time Passwörter in Unterkomponentte: " + response);
            }  
        }
        console.log("One Time Passwörter für: " + counter + " E-Mail-Adressen erstellt!");
        this.props.setShopConfigInitialList(true);
        window.location.assign("#/eventmgmt/shop");
    }

    //Change View to ShopManagement
    switchBackToShopmanagament() {
        window.location.assign("#/eventmgmt/shop")
    }

    render() {
        var Ansicht = [];
        var emailList = this.state.initialeListe;
        Ansicht =
            <Box style={{ position: 'absolute', left: '40%', top: '10%' }}>
                <Box pad="medium">
                    <Text size="large" weight="bold">Einlesen der Absolventen Liste</Text>
                </Box>

                <Box className="Eingaben">
                    <Box pad="medium">
                        <Text>Bitte eine Liste in der folgenden Darstellung einlesen:</Text>
                        <span><Text weight="bold">Header: </Text><Text>eMail; Name</Text></span>
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


                <List className="langeListe" pad="medium"
                    primaryKey="eMail"
                    secondaryKey="Name"
                    data={emailList}
                />

                <Box pad="medium">
                    <Button onClick={this.transferListForCreation} label="Passwörter erstellen"></Button>
                </Box>

                <Box pad="medium">
                    <Button onClick={this.switchBackToShopmanagament} label="Zurück" ></Button>
                </Box>

            </Box>
        return Ansicht;
    }
}
export default ShopManagamentAbsolventenListe;