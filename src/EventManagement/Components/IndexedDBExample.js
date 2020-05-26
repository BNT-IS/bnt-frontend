import React from 'react';
import { Box } from 'grommet';
//import { LocalTicketMirror } from './LocalTicketMirror';


class IndexedDBExample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    async showTicketHandler(){
        //console.log(document);
        //let ticket = await this.localTicketMirror.obliterateTicket('ca6c9409-0ec9-42fb-9ca7-d42a74642d7e').catch(console.warn);
        //console.log(ticket);
    }

    render() {
        return (
            <Box className="IndexedDBExample">
                
            </Box>
        );
    }
}

export default IndexedDBExample;
