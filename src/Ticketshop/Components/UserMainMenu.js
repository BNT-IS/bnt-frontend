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
            <Box className="UserMainMenu" direction="row" pad="medium" wrap={true}>
                <Link className="MenuLink" to="/guest/tickets">Tickets Anzeigen</Link>
                <Link className="MenuLink" to="/guest/buy">Tickets Buchen</Link>
                <Link className="MenuLink" to="/guest/bookings">Buchungen Anzeigen</Link>
            </Box>
        );
    }
}

export default UserMainMenu;
