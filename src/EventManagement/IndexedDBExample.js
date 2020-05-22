import React from 'react';
import { Box } from 'grommet';
//import { LocalTicketMirror } from './LocalTicketMirror';
import { TicketReaderManager } from './TicketReaderManager';

class IndexedDBExample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    async showTicketHandler(){
        //console.log(document);
        //let ticket = await this.localTicketMirror.obliterateTicket('ca6c9409-0ec9-42fb-9ca7-d42a74642d7e').catch(console.warn);
        //console.log(ticket);
        let trm = new TicketReaderManager();
        trm.connectTicketReader();
    }

    render() {
        return (
            <Box className="IndexedDBExample">
                <TicketReaderManager></TicketReaderManager>
            </Box>
        );
    }
}

export default IndexedDBExample;
