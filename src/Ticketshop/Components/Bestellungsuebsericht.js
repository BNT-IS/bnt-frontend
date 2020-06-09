import React from 'react';
import './TicketOverview.css';
import Obliterator from './Obliterator.js';
import { Box, Button, Text, Header } from 'grommet';

class Bestellungsuebsericht extends React.Component {

    constructor(props) {
        super(props);
        this.loadListHandler = this.loadListHandler.bind(this)
        this.state = { tableFilled: false, buchungen: [] };
    }

    async loadListHandler() {
        var liste = [{ label: "abc" }, { label: "blue" }, { label: "Yellow" }]

        var response = await fetch("http://localhost:3000/api/v1/bookings/user/0x1", {
            //method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 43059960ead1db519cbbed4aa934462808262fa6204daefabcab4b0b38b667d61828556556e4b9e80b6a91e9990fc8704bbf399cdafd41b06ddc0c31a500accb94b96fa096bf8789c7c582f9e5df0ead8f23ef77a9b045ccbb78a60cd2401592e79b8c396cd4520297cfb0603011a7f373f9dbbc6a37527bd160b5e754850cbf8779a4c5049e816a9b9bee268e110baf53e901e80aa8df89d6a07b92cf33b581294bedc1b8da2c9a583845b13766f4c89abc9ac3466b69748a1ba0bf6a80a8c2b6aa6ec084c88c2cc4d212470089dbb9e4bce056c90e8a0ebaa5b9e563c80d20ac173b791769eac9d29c509810086f1700c7cec0071a03bb7aed67fec7215979',
            }
        }).catch(console.log)

        if(!response) return

        console.log(response)

        var data = await response.json().catch(console.log)

        //this.setState({ buchungen: liste })
    }

    render() {
        var htmlListe = []
        this.state.buchungen.forEach((buchung) => {
            htmlListe.push(<p key={buchung.label}>{buchung.label}</p>)
        })

        return (
            <Box className="Bestellungsuebsericht" direction="column" gap="medium" pad="medium">
                <Box>
                    <Button label="Liste laden" onClick={this.loadListHandler}></Button>
                </Box>
                <Box>
                    {htmlListe}
                </Box>
            </Box>
        );
    }
}

export default Bestellungsuebsericht;
