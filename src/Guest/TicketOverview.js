import React from 'react';
import './TicketOverview.css';
import Obliterator from './Obliterator.js';
import { Box, Button, Text } from 'grommet';

class TicketOverview extends React.Component {

    constructor(props) {
        super(props);
        this.obliterate = this.obliterate.bind(this);
        this.onReadyHandler = this.onReadyHandler.bind(this);
        this.state = { obliterate: undefined };
    }

    onReadyHandler(){
        this.setState({ obliterate: undefined })
    }

    obliterate(){
        this.setState({ obliterate: "Absolvent" })
    }

    render() {
        return (
            <Box className="TicketOverview" direction="column" gap="medium" pad="medium">
                <Box>
                    <Box>
                        <h1 className="NumberOfTickets">4</h1>
                    </Box>
                    <Box>
                        <Box className="Ticket" direction="row" gap="small" pad="small">
                            <Text className="Type">Absolvent</Text><Button label="Einlösen" onClick={this.obliterate}></Button>
                        </Box>
                        <Box className="Ticket" direction="row" gap="small" pad="small">
                            <Text className="Type">Gast Regulär</Text><Button label="Einlösen" onClick={this.obliterate}></Button>
                        </Box>
                        <Box className="Ticket" direction="row" gap="small" pad="small">
                            <Text className="Type">Gast Regulär</Text><Button label="Einlösen" onClick={this.obliterate}></Button>
                        </Box>
                        <Box className="Ticket" direction="row" gap="small" pad="small">
                            <Text className="Type">Parken</Text><Button label="Einlösen" onClick={this.obliterate}></Button>
                        </Box>
                    </Box>
                </Box>
                {this.state.obliterate && <Obliterator ticketType={this.state.obliterate} onReady={this.onReadyHandler}></Obliterator>}
            </Box>
        );
    }
}

export default TicketOverview;
