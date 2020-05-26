import React from 'react';
import { Button } from 'grommet';
import './Dialog.css';

class Dialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
            <div className="dialog">
                <div className="dialog-background-box"></div>
                <div className="dialog-center">
                    <div className="dialog-content">
                        <div className="dialog-header">
                            <h1>{this.props.title}</h1>
                            <Button className="abort" onClick={this.props.onAbort}>X</Button>
                        </div>
                        <div className="dialog-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dialog;
