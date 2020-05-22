import React from 'react';
import { Box } from 'grommet';
import { Switch, Route } from "react-router-dom";
import IndexedDBExample from './IndexedDBExample';

class EventManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Box className="EventManagement">
                <Switch>
                    <Route path="/">
                        <IndexedDBExample></IndexedDBExample>
                    </Route>
                </Switch>
            </Box>
        );
    }
}

export default EventManagement;
