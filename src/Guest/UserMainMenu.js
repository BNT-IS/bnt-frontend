import React from 'react';
import './UserMainMenu.css';
import { Box } from 'grommet';
import { Link } from "react-router-dom";

class UserMainMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
            <Box className="UserMainMenu" direction="column" gap="medium" pad="medium">
                <Link className="MenuLink" to="/guest/tickets">Tickets Anzeigen</Link>
                <Link className="MenuLink" to="/guest/">Tickets Bestellen</Link>
                <Link className="MenuLink" to="/guest/">Bestellungen Anzeigen</Link>
                <Link className="MenuLink" to="/guest/setup">Setup</Link>
            </Box>
        );
    }
}

export default UserMainMenu;
