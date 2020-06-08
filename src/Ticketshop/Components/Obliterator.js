import React from 'react';
import './Obliterator.css';
import QRCode from 'qrcode';
import Web3 from 'web3';
import { Box, Button, Text } from 'grommet';

class Obliterator extends React.Component {

    constructor(props) {
        super(props);
        this.state = { qrcode: undefined };
        this.web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
        this.state = { error: false };
        this.sign();
    }

    async sign() {
        await this.connect();
        var from = await this.getSelectedAddress();

        var text = 'Hallo du Frosch!';
        var msg = this.web3.utils.stringToHex(text);

        var params = [msg, from]
        var method = 'personal_sign'

        this.web3.currentProvider.sendAsync({
            method,
            params,
            from,
        }, (err, result) => {
            if (err){
                this.setState({ error: true });
                return console.error(err)
            } 
            if (result.error){
                this.setState({ error: true });
                return console.error(result.error)
            } 

            const signature = result.result;
            
            QRCode.toDataURL(signature)
            .then(url => {
                this.setState({ qrcode: url });
            })
            .catch(err => {
                this.setState({ error: true });
                console.error(err);
            })

        })
    }

    async connect() {
        if (typeof window.ethereum !== 'undefined') {
            await window.ethereum.enable().catch(console.error);
        }
    }

    async getSelectedAddress() {
        var accounts = await this.web3.eth.getAccounts().catch(console.error);
        return accounts[0].toLowerCase();
    }

    render() {
        return (
            <Box className="Obliterator" direction="column" gap="medium" pad="medium">
                { !this.state.error && <Box>
                    <img src={this.state.qrcode} alt="QRCODE" width="300px" height="300px"></img>
                    <h2>{this.props.ticketType}</h2>
                </Box>}
                { this.state.error && <Box>
                    <Text>Ups, das hat nicht geklappt!</Text>
                </Box>}
                <Button label="Fertig" onClick={this.props.onReady}></Button>
            </Box>
        );
    }
}

export default Obliterator;
